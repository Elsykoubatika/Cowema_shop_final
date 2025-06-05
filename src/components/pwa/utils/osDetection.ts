
export interface OSInstructions {
  icon: React.ReactNode;
  title: string;
  steps: Array<{ icon: string; text: string }>;
}

export const getOSInstructions = (showManualInstructions: boolean): OSInstructions => {
  const userAgent = navigator.userAgent;
  const isWindows = userAgent.includes('Windows');
  const isMac = userAgent.includes('Mac');
  const isAndroid = userAgent.includes('Android');
  const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad');

  if (isAndroid) {
    return {
      icon: null, // Will be set in the component
      title: showManualInstructions ? "📱 Installer Cowema sur Android" : "🎉 Épingler Cowema sur Android",
      steps: showManualInstructions ? [
        { icon: "⋮", text: "Appuyez sur le menu ⋮ (3 points) du navigateur" },
        { icon: "📱", text: "Sélectionnez 'Ajouter à l'écran d'accueil'" },
        { icon: "✅", text: "Confirmez en appuyant sur 'Ajouter'" },
        { icon: "🚀", text: "L'icône Cowema apparaîtra sur votre écran d'accueil !" }
      ] : [
        { icon: "🏠", text: "L'icône Cowema est maintenant sur votre écran d'accueil" },
        { icon: "👆", text: "Maintenez appuyé sur l'icône pour la déplacer" },
        { icon: "⚡", text: "Glissez-la vers la barre de navigation pour un accès rapide" },
        { icon: "⭐", text: "Placez-la dans vos applications favorites" }
      ]
    };
  } else if (isIOS) {
    return {
      icon: null,
      title: showManualInstructions ? "📱 Installer Cowema sur iPhone/iPad" : "🎉 Épingler Cowema sur iOS",
      steps: showManualInstructions ? [
        { icon: "📤", text: "Appuyez sur le bouton Partager 📤 (en bas de Safari)" },
        { icon: "📱", text: "Faites défiler et sélectionnez 'Sur l'écran d'accueil'" },
        { icon: "✏️", text: "Modifiez le nom si souhaité, puis appuyez sur 'Ajouter'" },
        { icon: "🚀", text: "L'app Cowema sera maintenant accessible comme une app native !" }
      ] : [
        { icon: "🏠", text: "L'icône Cowema est maintenant sur votre écran d'accueil" },
        { icon: "👆", text: "Maintenez appuyé sur l'icône pour la déplacer" },
        { icon: "⚡", text: "Glissez-la vers le Dock en bas de l'écran" },
        { icon: "🌟", text: "Elle sera maintenant toujours accessible !" }
      ]
    };
  } else if (isWindows) {
    return {
      icon: null,
      title: "💻 Épingler à la barre des tâches Windows",
      steps: [
        { icon: "🔍", text: "Cherchez l'icône Cowema dans le menu Démarrer" },
        { icon: "🖱️", text: "Clic droit sur l'icône Cowema" },
        { icon: "📌", text: "Sélectionnez 'Épingler à la barre des tâches'" },
        { icon: "🚀", text: "L'icône apparaîtra maintenant dans votre barre des tâches !" }
      ]
    };
  } else if (isMac) {
    return {
      icon: null,
      title: "💻 Ajouter au Dock macOS",
      steps: [
        { icon: "🚀", text: "Ouvrez l'application Cowema depuis Launchpad" },
        { icon: "📍", text: "L'icône apparaîtra dans le Dock temporairement" },
        { icon: "🖱️", text: "Clic droit sur l'icône dans le Dock" },
        { icon: "⚙️", text: "Sélectionnez 'Options' → 'Garder dans le Dock'" }
      ]
    };
  }

  return {
    icon: null,
    title: "💻 Épingler l'application",
    steps: [
      { icon: "🔍", text: "Cherchez l'icône Cowema dans vos applications" },
      { icon: "🖱️", text: "Clic droit sur l'icône" },
      { icon: "📌", text: "Cherchez l'option 'Épingler' ou 'Pin to taskbar'" },
      { icon: "🚀", text: "L'icône sera maintenant facilement accessible !" }
    ]
  };
};
