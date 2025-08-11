import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Users, FileText, CheckCircle, Star } from 'lucide-react';
import Button from '../../components/ui/button/Button';
import Badge from '../../components/ui/badge/Badge';


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const setCurrentPage = (page: string) => {
    navigate(`/${page}`);
  };  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-yellow-400 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/4963437/pexels-photo-4963437.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="mb-8">
            <Badge color="success" variant="solid" size="md">
              Bienvenue sur la plateforme officielle
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Services consulaires simplifiés
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Accédez facilement aux services consulaires en ligne : demande de passeport, carte d'identité, actes d’état civil, et bien plus encore.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => setCurrentPage('signup')} endIcon={<ArrowRight />}>
              Rejoindre la plateforme
            </Button>
            <Button onClick={() => setCurrentPage('signin')} variant="outline">
              Se connecter
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-2">Fonctionnalités clés</h2>
            <p className="text-gray-600 text-lg">
              Tous les outils dont vous avez besoin pour simplifier votre vie administrative
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Demandes en ligne',
                description: 'Passeport, visa, actes d\'état civil... en quelques clics.',
                color: 'success',
              },
              {
                icon: Clock,
                title: 'Suivi en temps réel',
                description: 'Soyez informé à chaque étape de vos démarches.',
                color: 'warning',
              },
              {
                icon: Shield,
                title: 'Sécurité maximale',
                description: 'Vos données sont protégées avec un chiffrement bancaire.',
                color: 'error',
              },
              {
                icon: Users,
                title: 'Support humain',
                description: 'Nos agents sont là pour vous guider à tout moment.',
                color: 'info',
              },
              {
                icon: CheckCircle,
                title: 'Processus clair',
                description: 'Une expérience utilisateur pensée pour vous.',
                color: 'primary',
              },
              {
                icon: Star,
                title: 'Service premium',
                description: 'Des délais optimisés et un accompagnement personnalisé.',
                color: 'dark',
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                <Badge color={feature.color} variant="light" startIcon={<feature.icon className="h-5 w-5" />}>
                  {feature.title}
                </Badge>
                <p className="mt-4 text-gray-700 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Des milliers de Maliens nous font confiance</h2>
          <p className="text-gray-600 mb-12">
            Notre communauté s'agrandit chaque jour
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '15 000+', label: 'Utilisateurs actifs' },
              { number: '45 000+', label: 'Demandes traitées' },
              { number: '98%', label: 'Satisfaction' },
              { number: '12j', label: 'Délai moyen' },
            ].map((item, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-green-600">{item.number}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600">
        <div className="max-w-6xl mx-auto px-6 text-white text-center">
          <h2 className="text-4xl font-bold mb-8">Nos valeurs fondamentales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Solidarité', color: 'bg-green-700' },
              { title: 'Excellence', color: 'bg-yellow-500' },
              { title: 'Proximité', color: 'bg-red-600' },
            ].map((value, idx) => (
              <div key={idx} className="p-6 rounded-lg shadow-md bg-white/10 backdrop-blur-md">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white ${value.color}`}>
                  {value.title[0]}
                </div>
                <h3 className="text-xl font-semibold">{value.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Rejoignez la communauté</h2>
          <p className="text-gray-300 mb-8">
            Simplifiez dès aujourd’hui vos démarches auprès de l’ambassade du Mali.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setCurrentPage('signup')} >
              Créer mon compte
            </Button>
            <Button onClick={() => setCurrentPage('signin')} variant="outline">
              J’ai déjà un compte
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
