
import React from 'react';
import { useInfluencerManager } from '@/hooks/admin/useInfluencerManager';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart2, Search, Filter, CheckSquare, 
  Users, UserPlus, 
  Instagram, Youtube, Facebook, Music, Share2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import InfluencersTable from '@/components/admin/influencers/InfluencersTable';
import ApplicationsTable from '@/components/admin/influencers/ApplicationsTable';
import StatsDialog from '@/components/admin/influencers/StatsDialog';
import DetailsDialog from '@/components/admin/influencers/DetailsDialog';
import BulkActionDialog from '@/components/admin/influencers/BulkActionDialog';
import { SocialMediaStat } from '@/components/admin/influencers/SocialMediaStats';

const InfluencerList: React.FC = () => {
  const {
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    mainNetworkFilter,
    setMainNetworkFilter,
    selectedInfluencers,
    selectedApplications,
    showStatsDialog,
    setShowStatsDialog,
    showDetailsDialog,
    setShowDetailsDialog,
    selectedDetail,
    showActionDialog,
    setShowActionDialog,
    bulkAction,
    setBulkAction,
    filteredInfluencers,
    filteredApplications,
    handleViewInfluencer,
    handleApproveApplication,
    handleRejectApplication,
    showDetails,
    handleBulkAction,
    toggleInfluencerSelection,
    toggleApplicationSelection,
    toggleAllInfluencers,
    toggleAllApplications,
    formatDate,
    getMainSocialNetwork,
    socialStats: rawSocialStats
  } = useInfluencerManager();

  // Transform raw stats to SocialMediaStat format with icons
  const socialStats: SocialMediaStat[] = [
    {
      network: 'instagram',
      count: rawSocialStats.networks.instagram,
      averageFollowers: rawSocialStats.networks.instagram > 0 ? Math.round(rawSocialStats.totalFollowers / rawSocialStats.networks.instagram) : 0,
      icon: <Instagram className="h-4 w-4 text-pink-500" />
    },
    {
      network: 'tiktok',
      count: rawSocialStats.networks.tiktok,
      averageFollowers: rawSocialStats.networks.tiktok > 0 ? Math.round(rawSocialStats.totalFollowers / rawSocialStats.networks.tiktok) : 0,
      icon: <Music className="h-4 w-4" />
    },
    {
      network: 'youtube',
      count: rawSocialStats.networks.youtube,
      averageFollowers: rawSocialStats.networks.youtube > 0 ? Math.round(rawSocialStats.totalFollowers / rawSocialStats.networks.youtube) : 0,
      icon: <Youtube className="h-4 w-4 text-red-600" />
    },
    {
      network: 'facebook',
      count: rawSocialStats.networks.facebook,
      averageFollowers: rawSocialStats.networks.facebook > 0 ? Math.round(rawSocialStats.totalFollowers / rawSocialStats.networks.facebook) : 0,
      icon: <Facebook className="h-4 w-4 text-blue-600" />
    },
    {
      network: 'other',
      count: rawSocialStats.networks.other,
      averageFollowers: rawSocialStats.networks.other > 0 ? Math.round(rawSocialStats.totalFollowers / rawSocialStats.networks.other) : 0,
      icon: <Share2 className="h-4 w-4 text-gray-400" />
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-52" />
          </div>
        </div>
        
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">Gestion des influenceurs</h1>
          <p className="text-muted-foreground">
            Gérez les influenceurs et les candidatures
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowStatsDialog(true)}
            className="flex items-center gap-1"
          >
            <BarChart2 className="h-4 w-4" />
            <span>Statistiques</span>
          </Button>
          {selectedTab === 'applications' && selectedApplications.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>Actions ({selectedApplications.length})</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions groupées</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setBulkAction('approve');
                  setShowActionDialog(true);
                }}>
                  <span className="flex items-center gap-2 text-green-600">
                    Approuver
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setBulkAction('reject');
                  setShowActionDialog(true);
                }}>
                  <span className="flex items-center gap-2 text-red-600">
                    Rejeter
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Rechercher par nom, email, code ou ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={mainNetworkFilter} onValueChange={setMainNetworkFilter}>
            <SelectTrigger className="w-full md:w-52">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filtrer par réseau" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les réseaux</SelectItem>
              <SelectItem value="instagram">
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <span>Instagram</span>
                </div>
              </SelectItem>
              <SelectItem value="tiktok">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <span>TikTok</span>
                </div>
              </SelectItem>
              <SelectItem value="youtube">
                <div className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-red-600" />
                  <span>YouTube</span>
                </div>
              </SelectItem>
              <SelectItem value="facebook">
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <span>Facebook</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="influencers" className="flex items-center gap-2">
            <Users size={16} />
            <span>Influenceurs</span>
            <Badge variant="secondary" className="ml-1">{filteredInfluencers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <UserPlus size={16} />
            <span>Candidatures</span>
            <Badge variant="secondary" className="ml-1">{filteredApplications.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="influencers">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Liste des influenceurs</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {selectedInfluencers.length > 0 && 
                    `${selectedInfluencers.length} sélectionné${selectedInfluencers.length > 1 ? 's' : ''}`}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <InfluencersTable 
                influencers={filteredInfluencers}
                selectedInfluencers={selectedInfluencers}
                toggleInfluencerSelection={toggleInfluencerSelection}
                toggleAllInfluencers={toggleAllInfluencers}
                handleViewInfluencer={handleViewInfluencer}
                showDetails={showDetails}
                getMainSocialNetwork={getMainSocialNetwork}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Candidatures d'influenceurs</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {selectedApplications.length > 0 && 
                    `${selectedApplications.length} sélectionné${selectedApplications.length > 1 ? 's' : ''}`}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ApplicationsTable 
                applications={filteredApplications}
                selectedApplications={selectedApplications}
                toggleApplicationSelection={toggleApplicationSelection}
                toggleAllApplications={toggleAllApplications}
                showDetails={showDetails}
                handleApproveApplication={handleApproveApplication}
                handleRejectApplication={handleRejectApplication}
                getMainSocialNetwork={getMainSocialNetwork}
                formatDate={formatDate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <StatsDialog
        open={showStatsDialog}
        onOpenChange={setShowStatsDialog}
        stats={socialStats}
      />

      <DetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        selectedDetail={selectedDetail}
        formatDate={formatDate}
        handleViewInfluencer={handleViewInfluencer}
        handleApproveApplication={handleApproveApplication}
        handleRejectApplication={handleRejectApplication}
      />

      <BulkActionDialog
        open={showActionDialog}
        onOpenChange={setShowActionDialog}
        bulkAction={bulkAction}
        selectedCount={selectedApplications.length}
        onConfirm={handleBulkAction}
      />
    </div>
  );
};

export default InfluencerList;
