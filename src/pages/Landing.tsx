import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  CreditCard, 
  Globe, 
  TrendingUp, 
  Users, 
  Award,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your funds are protected by advanced encryption and multi-layer security protocols."
    },
    {
      icon: CreditCard,
      title: "Digital Banking",
      description: "Manage your finances anywhere, anytime with our comprehensive digital platform."
    },
    {
      icon: Globe,
      title: "Global Transfers",
      description: "Send money worldwide with competitive rates and lightning-fast processing."
    },
    {
      icon: TrendingUp,
      title: "Investment Tools",
      description: "Grow your wealth with our suite of investment and savings products."
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Our dedicated customer service team is available around the clock to assist you."
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in digital banking innovation and customer satisfaction."
    }
  ];

  const stats = [
    { number: "2M+", label: "Active Customers" },
    { number: "150+", label: "Countries Served" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "£50B+", label: "Assets Under Management" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Credit Stirling Bank PLC</span>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            Trusted by millions worldwide
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Banking Made Simple, <span className="text-primary">Secure</span> & Smart
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of banking with Credit Stirling Bank PLC. 
            From everyday transactions to global investments, we provide comprehensive 
            financial solutions tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
              Open Your Account
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Credit Stirling Bank?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with traditional banking values 
              to deliver exceptional financial services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comprehensive Banking Services
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Banking</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Current & Savings Accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Debit & Credit Cards
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Personal Loans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Mortgages
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Banking</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Business Accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Merchant Services
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Business Loans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Cash Management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Investment Portfolios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Retirement Planning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Wealth Management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Financial Advisory
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                About Credit Stirling Bank PLC
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  Founded in 1985, Credit Stirling Bank PLC has been at the forefront of 
                  financial innovation for over three decades. We've evolved from a traditional 
                  high-street bank to a leading digital financial institution, serving millions 
                  of customers across 150+ countries.
                </p>
                <p>
                  Our mission is simple: to democratize access to world-class financial services 
                  through technology, while maintaining the personal touch and trust that has 
                  defined banking for generations.
                </p>
                <p>
                  Today, we're proud to be recognized as one of the most innovative banks in Europe, 
                  with numerous awards for digital banking excellence, customer satisfaction, and 
                  sustainable finance initiatives.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6">
                <div className="text-2xl font-bold text-primary mb-2">38+</div>
                <div className="text-sm text-muted-foreground">Years of Experience</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-2xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-2xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Banking Experts</div>
              </Card>
              <Card className="text-center p-6">
                <div className="text-2xl font-bold text-primary mb-2">£2.5B</div>
                <div className="text-sm text-muted-foreground">Daily Transactions</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              Ready to start your banking journey with us? We're here to help.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-muted-foreground">+44 20 1234 5678</p>
              <p className="text-sm text-muted-foreground mt-1">
                <Clock className="h-3 w-3 inline mr-1" />
                24/7 Support Available
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-muted-foreground">support@creditstirling.com</p>
              <p className="text-sm text-muted-foreground mt-1">Response within 2 hours</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-muted-foreground">1 Sterling Square, London EC1A 1AA</p>
              <p className="text-sm text-muted-foreground mt-1">Mon-Fri: 9AM-5PM</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Banking Experience?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of satisfied customers who have made the switch to smarter, 
            more secure banking with Credit Stirling Bank PLC.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-3"
            onClick={() => navigate('/auth')}
          >
            Open Your Account Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-background border-t">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">Credit Stirling Bank PLC</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for comprehensive financial solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Personal Banking</li>
                <li>Business Banking</li>
                <li>Investments</li>
                <li>Loans & Mortgages</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Security</li>
                <li>Mobile App</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>Regulatory Info</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Credit Stirling Bank PLC. All rights reserved. Regulated by the Financial Conduct Authority.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;