
import { useToast } from '@/hooks/use-toast';

export const useUserNotifications = () => {
  const { toast } = useToast();

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      variant: "destructive",
      title,
      description,
    });
  };

  const showUserCreatedToast = (userName: string, email: string) => {
    showSuccessToast(
      "✅ Utilisateur créé",
      `${userName} (${email}) a été créé avec succès`
    );
  };

  const showUserUpdatedToast = () => {
    showSuccessToast(
      "✅ Utilisateur mis à jour",
      "Les informations ont été mises à jour"
    );
  };

  const showUserDeletedToast = () => {
    showSuccessToast(
      "✅ Utilisateur supprimé",
      "L'utilisateur a été supprimé"
    );
  };

  const showPasswordResetToast = () => {
    showSuccessToast(
      "✅ Mot de passe réinitialisé",
      "Le mot de passe a été réinitialisé"
    );
  };

  const showLoadingErrorToast = (error: string) => {
    showErrorToast(
      "❌ Erreur de chargement",
      error
    );
  };

  const showCreateErrorToast = (error: string) => {
    showErrorToast(
      "❌ Erreur de création",
      error || "Impossible de créer l'utilisateur"
    );
  };

  const showUpdateErrorToast = () => {
    showErrorToast(
      "❌ Erreur",
      "Impossible de mettre à jour l'utilisateur"
    );
  };

  const showDeleteErrorToast = () => {
    showErrorToast(
      "❌ Erreur",
      "Impossible de supprimer l'utilisateur"
    );
  };

  const showPasswordResetErrorToast = () => {
    showErrorToast(
      "❌ Erreur",
      "Impossible de réinitialiser le mot de passe"
    );
  };

  return {
    showUserCreatedToast,
    showUserUpdatedToast,
    showUserDeletedToast,
    showPasswordResetToast,
    showLoadingErrorToast,
    showCreateErrorToast,
    showUpdateErrorToast,
    showDeleteErrorToast,
    showPasswordResetErrorToast
  };
};
