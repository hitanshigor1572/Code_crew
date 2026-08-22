"use client";

import * as React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  User,
  Settings,
  Heart,
  Award,
  Globe2,
  Moon,
  Sun,
  ShieldAlert,
  Save,
  CheckCircle2,
  DollarSign,
  Compass,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BadgeList } from "@/components/common/BadgeList";
import { DestinationCard } from "@/components/trip/DestinationCard";
import { getCurrentUser, updateUserProfile, toggleSaveDestination } from "@/lib/services/user.service";
import { getCities } from "@/lib/services/city.service";
import { UserProfile } from "@/types/user";
import { City } from "@/types/city";
import { toast } from "sonner";

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [cities, setCities] = React.useState<City[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Form states
  const [name, setName] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [currency, setCurrency] = React.useState("USD");
  const [travelPace, setTravelPace] = React.useState("moderate");
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [userData, citiesData] = await Promise.all([getCurrentUser(), getCities()]);
        setUser(userData);
        setCities(citiesData);
        setName(userData.name);
        setBio(userData.bio);
        setLocation(userData.location);
        setCurrency(userData.currency);
        setTravelPace(userData.travelPace);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await updateUserProfile({
      name,
      bio,
      location,
      currency: currency as any,
      travelPace: travelPace as any,
    });
    setUser(updated);
    toast.success("Profile preferences saved successfully!");
  };

  const handleToggleWishlist = async (cityId: string) => {
    const updated = await toggleSaveDestination(cityId);
    if (user) {
      setUser({ ...user, savedDestinations: updated });
    }
  };

  if (loading || !user) {
    return <div className="p-12 text-center text-xs text-zinc-400">Loading user profile...</div>;
  }

  const wishlistCities = cities.filter((c) => user.savedDestinations.includes(c.id));

  return (
    <div className="space-y-8">
      {/* Profile Overview Header Card */}
      <Card className="p-6 sm:p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 ring-4 ring-primary/20 shadow-md">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  {user.name}
                </h1>
                <Badge variant="default" className="text-[10px]">
                  Voyager
                </Badge>
              </div>
              <p className="text-xs text-zinc-500">{user.email} • Member since {user.joinedDate}</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {user.location}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-center">
              <span className="text-xl font-extrabold text-primary block">
                {user.countriesVisited}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                Countries
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 text-center">
              <span className="text-xl font-extrabold text-secondary block">
                {user.tripsCompleted}
              </span>
              <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                Completed
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Profile Tabs */}
      <Tabs defaultValue="achievements" className="w-full space-y-6">
        <TabsList className="h-12 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl">
          <TabsTrigger value="achievements" className="rounded-xl text-xs font-bold gap-1.5">
            <Award className="h-3.5 w-3.5" />
            <span>Badges & Passport ({user.badges.length})</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="rounded-xl text-xs font-bold gap-1.5">
            <Heart className="h-3.5 w-3.5" />
            <span>Saved Wishlist ({wishlistCities.length})</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl text-xs font-bold gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            <span>Preferences & Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. Achievements & Badges Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Travel Badges & Passport Stamps
            </h3>
            <span className="text-xs text-zinc-400">Unlock more by logging multi-city journeys</span>
          </div>
          <BadgeList badges={user.badges} />
        </TabsContent>

        {/* 2. Wishlist Tab */}
        <TabsContent value="wishlist" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Saved Destinations Wishlist
            </h3>
            <span className="text-xs text-zinc-400">{wishlistCities.length} Saved Places</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistCities.map((city) => (
              <DestinationCard
                key={city.id}
                city={city}
                isSaved={true}
                onToggleSave={handleToggleWishlist}
              />
            ))}
          </div>
        </TabsContent>

        {/* 3. Settings & Preferences Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 space-y-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Account & Travel Preferences
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Display Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-2xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Home Base / Location
                  </label>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Bio / Travel Mantra
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="rounded-2xl text-xs min-h-[70px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Default Currency
                  </label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="rounded-2xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="CHF">CHF (Fr.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Travel Pace
                  </label>
                  <Select value={travelPace} onValueChange={setTravelPace}>
                    <SelectTrigger className="rounded-2xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="relaxed">Relaxed (1-2 activities/day)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-4 activities/day)</SelectItem>
                      <SelectItem value="fast">Fast-paced (Action packed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Theme Mode
                  </label>
                  <Select value={theme || "system"} onValueChange={(val) => setTheme(val)}>
                    <SelectTrigger className="rounded-2xl text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="light">Light Mode</SelectItem>
                      <SelectItem value="dark">Dark Mode</SelectItem>
                      <SelectItem value="system">System Synchronized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-3">
                <Button type="submit" className="rounded-2xl font-bold gap-2 text-xs h-11 px-6 shadow-md shadow-primary/20">
                  <Save className="h-4 w-4" />
                  <span>Save Profile Updates</span>
                </Button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-8 pt-6 border-t border-danger/20 space-y-3">
              <h4 className="text-sm font-bold text-danger flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Danger Zone</span>
              </h4>
              <div className="p-4 rounded-2xl border border-danger/30 bg-danger/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Delete GlobeTrotter Account
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Permanently wipe your profile, saved trips, and passport badges.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteModalOpen(true)}
                  className="rounded-xl text-xs shrink-0"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="rounded-3xl p-6 sm:max-w-md">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold text-danger">Confirm Account Deletion</DialogTitle>
            <DialogDescription className="text-xs">
              This action cannot be undone. Are you sure you want to permanently delete your GlobeTrotter profile?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteModalOpen(false);
                toast.error("Account deletion simulated in demo mode");
              }}
              className="rounded-xl"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
