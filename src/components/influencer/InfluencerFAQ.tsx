
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Quelles sont les conditions pour devenir influenceur Cowema?",
    answer: "Pour devenir influenceur Cowema, vous devez avoir une audience active et engagée sur au moins un réseau social, avec idéalement plus de 5 000 abonnés. Votre contenu doit être en lien avec nos produits et votre audience doit correspondre à notre marché cible."
  },
  {
    question: "Comment mes commissions sont-elles calculées?",
    answer: "Les commissions sont calculées sur le montant total des achats effectués par les clients qui utilisent votre code promo ou votre lien de parrainage. Le pourcentage de commission varie entre 5% et 10% selon votre niveau d'influence et vos performances."
  },
  {
    question: "Comment sont payées les commissions?",
    answer: "Les commissions sont payées mensuellement par virement bancaire ou mobile money, à condition que le montant cumulé dépasse 10 000 FCFA. Si le montant est inférieur, il sera reporté au mois suivant."
  },
  {
    question: "Combien de temps reste valide un code de parrainage?",
    answer: "Lorsqu'un visiteur utilise votre lien ou votre code de parrainage, celui-ci reste valide pendant 30 jours. Tout achat effectué par ce visiteur durant cette période vous sera attribué."
  },
  {
    question: "Puis-je suivre mes performances en temps réel?",
    answer: "Oui, une fois approuvé comme influenceur, vous aurez accès à un tableau de bord personnel où vous pourrez suivre le nombre de clics sur vos liens, les conversions, les commissions générées et les paiements effectués."
  },
  {
    question: "Combien de temps dure le processus d'approbation?",
    answer: "Nous examinons toutes les candidatures dans un délai de 7 jours ouvrables. Si votre candidature est approuvée, vous recevrez un email avec les instructions pour accéder à votre espace influenceur."
  },
  {
    question: "Est-ce que je peux promouvoir les produits comme je le souhaite?",
    answer: "Vous avez une grande liberté créative, mais nous vous demandons de respecter certaines directives pour préserver l'image de la marque. Ces directives vous seront communiquées lors de votre approbation."
  }
];

const InfluencerFAQ: React.FC = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container-cowema">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Questions fréquentes</h2>
          
          <Accordion type="single" collapsible className="bg-white p-6 rounded-lg shadow-cowema">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Vous avez d'autres questions? Contactez-nous à{' '}
              <a href="mailto:influenceurs@cowema.com" className="text-primary hover:underline">
                influenceurs@cowema.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerFAQ;
