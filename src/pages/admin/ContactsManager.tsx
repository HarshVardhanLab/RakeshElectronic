import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Loader2,
  Search,
  Check,
  Trash2,
  Calendar
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { useContacts, useMarkContactRead, useDeleteContact } from '../../hooks/useContacts';
import { toast } from 'sonner';
import type { Contact } from '../../types/database';

export default function ContactsManager() {
  const { data: contacts, isLoading } = useContacts();
  const markRead = useMarkContactRead();
  const deleteContact = useDeleteContact();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'unread' && !contact.is_read) ||
      (filter === 'read' && contact.is_read);

    return matchesSearch && matchesFilter;
  });

  const handleMarkRead = async (id: string) => {
    try {
      await markRead.mutateAsync(id);
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact.mutateAsync(id);
      toast.success('Message deleted');
      setDeleteConfirm(null);
      setSelectedContact(null);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleMarkAllRead = async () => {
    const unread = contacts?.filter(c => !c.is_read) || [];
    for (const contact of unread) {
      await markRead.mutateAsync(contact.id);
    }
    toast.success(`Marked ${unread.length} messages as read`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const unreadCount = contacts?.filter(c => !c.is_read).length || 0;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({contacts?.length || 0})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('read')}
          >
            Read
          </Button>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Messages List */}
      {filteredContacts?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-text-muted">
            No messages found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredContacts?.map((contact) => (
            <Card 
              key={contact.id} 
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                !contact.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
              }`}
              onClick={() => {
                setSelectedContact(contact);
                if (!contact.is_read) handleMarkRead(contact.id);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${!contact.is_read ? 'text-foreground' : 'text-text-secondary'}`}>
                        {contact.name}
                      </h3>
                      {!contact.is_read && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">New</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-muted mb-2">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </span>
                      {contact.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(contact.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    {contact.subject && (
                      <p className="text-sm font-medium mb-1">{contact.subject}</p>
                    )}
                    <p className="text-sm text-text-secondary line-clamp-2">{contact.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message from {selectedContact?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Email:</span>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
                <div>
                  <span className="text-text-muted">Phone:</span>
                  <p className="font-medium">{selectedContact.phone || '-'}</p>
                </div>
                <div>
                  <span className="text-text-muted">Date:</span>
                  <p className="font-medium">
                    {new Date(selectedContact.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Subject:</span>
                  <p className="font-medium">{selectedContact.subject || 'General Inquiry'}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-text-muted">Message:</span>
                <div className="mt-2 p-4 bg-secondary rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-red-600"
                  onClick={() => setDeleteConfirm(selectedContact.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button asChild>
                  <a href={`mailto:${selectedContact.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Message?</DialogTitle>
          </DialogHeader>
          <p className="text-text-secondary">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleteContact.isPending}
            >
              {deleteContact.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
