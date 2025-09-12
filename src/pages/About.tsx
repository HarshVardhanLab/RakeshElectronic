import { useTranslation } from "react-i18next";
import Navigation from "../components/Navigation";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, Target, Eye, Award, Clock, Shield, Wrench, Zap } from "lucide-react";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <h1 className="font-poppins font-bold text-4xl text-foreground">
                {t('about.hero.title')}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-poppins font-bold text-3xl text-foreground mb-6">
                {t('about.story.title')}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t('about.story.paragraph1')}</p>
                <p>{t('about.story.paragraph2')}</p>
                <p>{t('about.story.paragraph3')}</p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 backdrop-blur-sm border border-border">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">{t('about.stats.repairs')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">5★</div>
                    <div className="text-sm text-muted-foreground">{t('about.stats.rating')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">24/7</div>
                    <div className="text-sm text-muted-foreground">{t('about.stats.support')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">10+</div>
                    <div className="text-sm text-muted-foreground">{t('about.stats.years')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl text-foreground mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-poppins font-semibold text-xl text-foreground">
                    {t('about.mission.title')}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.mission.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-secondary" />
                  </div>
                  <h3 className="font-poppins font-semibold text-xl text-foreground">
                    {t('about.vision.title')}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.vision.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl text-foreground mb-4">
              {t('about.coreValues.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('about.coreValues.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('about.coreValues.quality.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('about.coreValues.quality.description')}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('about.coreValues.reliability.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('about.coreValues.reliability.description')}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('about.coreValues.trust.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('about.coreValues.trust.description')}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{t('about.coreValues.innovation.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('about.coreValues.innovation.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl text-foreground mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
                  {t('about.team.founder.name')}
                </h3>
                <Badge variant="secondary" className="mb-3">
                  {t('about.team.founder.role')}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {t('about.team.founder.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
                  {t('about.team.technicians.name')}
                </h3>
                <Badge variant="secondary" className="mb-3">
                  {t('about.team.technicians.role')}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {t('about.team.technicians.description')}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-accent" />
                </div>
                <h3 className="font-poppins font-semibold text-lg text-foreground mb-2">
                  {t('about.team.support.name')}
                </h3>
                <Badge variant="secondary" className="mb-3">
                  {t('about.team.support.role')}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {t('about.team.support.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="font-poppins font-bold text-primary">RAKESH ELECTRONICS</span>
            </div>
            <p className="text-text-muted text-sm max-w-md mx-auto mb-4">
              Your trusted partner for electronic repairs and premium appliances. 
              Quality service with reliable technology solutions.
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs text-text-secondary">
              <span>© 2024 RAKESH Electronics</span>
              <span>•</span>
              <span>All Rights Reserved</span>
              <span>•</span>
              <span>Made with 💚 in India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
