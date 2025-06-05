
import React from 'react';
import { useAISales } from '@/hooks/admin/useAISales';
import AdminPageLayout from '@/components/admin/layout/AdminPageLayout';
import AdminPageHeader from '@/components/admin/layout/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Users, 
  Target, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Clock,
  RefreshCw,
  Zap,
  BarChart3,
  DollarSign,
  Activity,
  AlertTriangle,
  Star,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const AISales: React.FC = () => {
  const {
    customerScores,
    salesActions,
    analytics,
    isLoading,
    isGeneratingActions,
    generateAIActions,
    executeAction,
    declineAction,
    refreshData
  } = useAISales();

  const getActionTypeColor = (actionType: string) => {
    switch (actionType) {
      case 'reactivation': return 'bg-orange-500';
      case 'upsell': return 'bg-green-500';
      case 'cross_sell': return 'bg-blue-500';
      case 'new_product': return 'bg-purple-500';
      case 'loyalty': return 'bg-pink-500';
      case 'retention': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    switch (actionType) {
      case 'reactivation': return 'Réactivation';
      case 'upsell': return 'Montée en gamme';
      case 'cross_sell': return 'Vente croisée';
      case 'new_product': return 'Nouveau produit';
      case 'loyalty': return 'Fidélisation';
      case 'retention': return 'Rétention';
      default: return actionType;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const pendingActions = salesActions.filter(a => a.status === 'pending');
  const totalExpectedRevenue = pendingActions.reduce((sum, action) => sum + action.expected_revenue, 0);
  const averageConfidence = pendingActions.length > 0 
    ? pendingActions.reduce((sum, action) => sum + action.confidence_level, 0) / pendingActions.length 
    : 0;

  // Données pour les graphiques
  const chartConfig = {
    value: {
      label: "Valeur",
      color: "hsl(var(--chart-1))",
    },
    prediction: {
      label: "Prédiction",
      color: "hsl(var(--chart-2))",
    },
  };

  const segmentColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  const conversionData = analytics ? [
    { name: 'Réactivation', value: analytics.conversion_rates.reactivation * 100 },
    { name: 'Upsell', value: analytics.conversion_rates.upsell * 100 },
    { name: 'Cross-sell', value: analytics.conversion_rates.cross_sell * 100 },
    { name: 'Rétention', value: analytics.conversion_rates.retention * 100 },
  ] : [];

  const segmentData = analytics ? [
    { name: 'VIP', value: analytics.customer_segments.vip },
    { name: 'Réguliers', value: analytics.customer_segments.regular },
    { name: 'Nouveaux', value: analytics.customer_segments.new },
    { name: 'À risque', value: analytics.customer_segments.at_risk },
  ] : [];

  return (
    <AdminPageLayout>
      <AdminPageHeader 
        title="Analytics & AI Sales" 
        description="Intelligence artificielle avancée pour optimiser vos ventes"
        icon={<Brain className="h-6 w-6" />}
      />
      
      <div className="space-y-6">
        {/* Stats Cards Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Clients analysés</p>
                  <p className="text-2xl font-bold">{customerScores.length}</p>
                  {analytics && (
                    <p className="text-xs text-green-600">
                      {analytics.active_customers} actifs
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Actions IA</p>
                  <p className="text-2xl font-bold">{pendingActions.length}</p>
                  <p className="text-xs text-gray-500">en attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Rev. attendus</p>
                  <p className="text-2xl font-bold">{(totalExpectedRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500">FCFA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Confiance moy.</p>
                  <p className="text-2xl font-bold">{Math.round(averageConfidence * 100)}%</p>
                  <Progress value={averageConfidence * 100} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium">Taux succès</p>
                  <p className="text-2xl font-bold">
                    {analytics ? Math.round(analytics.performance_metrics.success_rate) : 0}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {analytics ? analytics.performance_metrics.actions_executed : 0} exécutées
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tendances de revenus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Tendances de revenus (30j)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.revenue_trends}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="var(--color-value)" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="prediction" 
                        stroke="var(--color-prediction)" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Taux de conversion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Taux de conversion par action</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Segmentation clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Segmentation clients</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {segmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={segmentColors[index % segmentColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Métriques de performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Métriques de performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Score d'engagement moyen</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={analytics.performance_metrics.avg_engagement_score} className="w-24" />
                    <span className="text-sm font-bold">
                      {Math.round(analytics.performance_metrics.avg_engagement_score)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Actions générées</span>
                  <span className="text-lg font-bold">{analytics.performance_metrics.total_actions_generated}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Revenus générés</span>
                  <span className="text-lg font-bold text-green-600">
                    {(analytics.performance_metrics.revenue_generated / 1000).toFixed(0)}K FCFA
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taux de succès global</span>
                  <Badge variant="outline" className="bg-green-50">
                    {Math.round(analytics.performance_metrics.success_rate)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons Enhanced */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Centre de contrôle IA avancé</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => generateAIActions()}
                disabled={isGeneratingActions || isLoading}
                className="flex items-center space-x-2"
              >
                {isGeneratingActions ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                <span>
                  {isGeneratingActions ? 'Analyse IA en cours...' : 'Générer actions IA intelligentes'}
                </span>
              </Button>
              
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser données</span>
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Max 3 actions/client/semaine</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Lightbulb className="h-4 w-4" />
                <span>Algorithme d'optimisation actif</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions List Enhanced */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Actions IA recommandées ({pendingActions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Analyse avancée des clients en cours...</p>
              </div>
            ) : pendingActions.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Aucune action IA en attente</p>
                <p className="text-sm text-gray-400">Cliquez sur "Générer actions IA intelligentes" pour commencer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingActions
                  .sort((a, b) => (b.success_probability || 0) - (a.success_probability || 0))
                  .map((action) => (
                  <div key={action.id} className="border rounded-lg p-4 space-y-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getActionTypeColor(action.action_type)}>
                            {getActionTypeLabel(action.action_type)}
                          </Badge>
                          <h3 className="font-semibold">{action.customer_name}</h3>
                          <Badge variant="outline">
                            Score: {Math.round(action.priority_score)}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50">
                            Succès: {Math.round((action.success_probability || 0) * 100)}%
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{action.ai_reasoning}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500">Revenus attendus</p>
                            <p className="text-sm font-semibold">{action.expected_revenue.toLocaleString()} FCFA</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Confiance IA</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={action.confidence_level * 100} className="flex-1" />
                              <span className="text-sm">{Math.round(action.confidence_level * 100)}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Probabilité succès</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={(action.success_probability || 0) * 100} className="flex-1" />
                              <span className="text-sm">{Math.round((action.success_probability || 0) * 100)}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Contact</p>
                            <p className="text-sm">{action.customer_phone}</p>
                          </div>
                        </div>

                        {/* Produits recommandés avec probabilité */}
                        {action.recommended_products.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500 mb-2">Produits optimisés par IA</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {action.recommended_products.map((product, index) => (
                                <div key={index} className="bg-gray-50 rounded p-2">
                                  <p className="text-sm font-medium">{product.name}</p>
                                  <p className="text-xs text-gray-600">{product.price.toLocaleString()} FCFA</p>
                                  <p className="text-xs text-blue-600">{product.reason}</p>
                                  {product.conversion_probability && (
                                    <p className="text-xs text-green-600">
                                      {Math.round(product.conversion_probability * 100)}% de conversion
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Message Preview Enhanced */}
                        <div className="bg-green-50 rounded p-3 mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            Aperçu du message IA personnalisé
                          </p>
                          <p className="text-sm whitespace-pre-line">{action.message_template.slice(0, 200)}...</p>
                        </div>

                        {/* Timing optimal */}
                        {action.optimal_send_time && (
                          <div className="text-xs text-gray-500">
                            ⏰ Moment optimal: {new Date(action.optimal_send_time).toLocaleString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => executeAction(action.id)}
                        className="flex items-center space-x-2"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Envoyer WhatsApp</span>
                      </Button>
                      
                      <Button
                        onClick={() => declineAction(action.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Refuser</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2"
                        onClick={() => toast.info("Fonctionnalité d'édition à venir")}
                      >
                        <Lightbulb className="h-4 w-4" />
                        <span>Optimiser</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customer Scores Enhanced */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Top clients (Intelligence IA)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerScores.slice(0, 10).map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{customer.customer_name}</h4>
                        {getTrendIcon(customer.trend)}
                        {customer.engagement_score >= 80 && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-600">{customer.customer_city}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs">
                        <span>💰 {customer.total_spent.toLocaleString()} FCFA</span>
                        <span>📦 {customer.order_frequency} commandes</span>
                        <span>⏱️ {customer.last_activity_days}j</span>
                        <span className={`px-2 py-1 rounded ${
                          customer.trend === 'increasing' ? 'bg-green-100 text-green-600' :
                          customer.trend === 'decreasing' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {customer.trend === 'increasing' ? '↗️ Croissant' :
                           customer.trend === 'decreasing' ? '↘️ Décroissant' :
                           '➡️ Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <Progress value={customer.engagement_score} className="w-20" />
                      <span className="text-sm font-semibold">{Math.round(customer.engagement_score)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Achat: {Math.round(customer.purchase_probability * 100)}%
                    </p>
                    {customer.next_contact_date && (
                      <p className="text-xs text-blue-600">
                        Contact: {new Date(customer.next_contact_date).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AISales;
