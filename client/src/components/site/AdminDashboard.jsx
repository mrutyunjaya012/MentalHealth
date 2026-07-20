import { useState, useEffect, useMemo, useCallback } from "react";
import { usersApi } from "@/api/usersApi";
import { predictionsApi } from "@/api/predictionsApi";
import {
  Users,
  Activity,
  Heart,
  Brain,
  TrendingUp,
  Trash2,
  Shield,
  ShieldAlert,
  Calendar,
  UserX,
  Search,
  RefreshCw,
  Moon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

export function AdminDashboard() {
  const [usersList, setUsersList] = useState([]);
  const [predictionsList, setPredictionsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (showRefreshToast = false) => {
    try {
      setError(null);
      const [users, predictions] = await Promise.all([
        usersApi.getAll(),
        predictionsApi.getAll(),
      ]);
      setUsersList(users);
      setPredictionsList(predictions);
      if (showRefreshToast) {
        toast.success("Database records synchronized.");
      }
    } catch (err) {
      const message = err.message || "Failed to load dashboard data";
      setError(message);
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      await fetchData();
      setLoading(false);
    }
    loadInitialData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const handleDeleteUser = async (email) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    setActionLoading(`user-${email}`);
    try {
      await usersApi.delete(email);
      setUsersList((prev) => prev.filter((u) => u.email !== email));
      toast.success(`User ${email} deleted.`);
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRole = async (email, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setActionLoading(`role-${email}`);
    try {
      const response = await usersApi.updateRole(email, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u.email === email ? response.data : u))
      );
      toast.success(`Updated role for ${email} to ${newRole}.`);
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePrediction = async (id) => {
    if (!confirm("Are you sure you want to delete this prediction entry?")) return;

    setActionLoading(`pred-${id}`);
    try {
      await predictionsApi.delete(id);
      setPredictionsList((prev) => prev.filter((p) => p.id !== id));
      toast.success("Prediction entry removed.");
    } catch (err) {
      toast.error(err.message || "Failed to delete prediction");
    } finally {
      setActionLoading(null);
    }
  };

  const stats = useMemo(() => {
    const totalUsers = usersList.length;
    const totalPredictions = predictionsList.length;

    let avgDep = 0;
    let avgAnx = 0;
    let avgSleep = 0;

    if (totalPredictions > 0) {
      const sumDep = predictionsList.reduce(
        (acc, curr) => acc + curr.results.depression,
        0
      );
      const sumAnx = predictionsList.reduce(
        (acc, curr) => acc + curr.results.anxiety,
        0
      );
      const sumSleep = predictionsList.reduce(
        (acc, curr) => acc + curr.results.sleep,
        0
      );

      avgDep = Math.round(sumDep / totalPredictions);
      avgAnx = Math.round(sumAnx / totalPredictions);
      avgSleep = Math.round(sumSleep / totalPredictions);
    }

    return { totalUsers, totalPredictions, avgDep, avgAnx, avgSleep };
  }, [usersList, predictionsList]);

  const chartData = useMemo(() => {
    let depLow = 0,
      depMod = 0,
      depHigh = 0;
    let anxLow = 0,
      anxMod = 0,
      anxHigh = 0;
    let slpLow = 0,
      slpMod = 0,
      slpHigh = 0;

    predictionsList.forEach((p) => {
      const d = p.results.depression;
      const a = p.results.anxiety;
      const s = p.results.sleep;

      if (d < 35) depLow++;
      else if (d <= 70) depMod++;
      else depHigh++;

      if (a < 35) anxLow++;
      else if (a <= 70) anxMod++;
      else anxHigh++;

      if (s < 35) slpLow++;
      else if (s <= 70) slpMod++;
      else slpHigh++;
    });

    return [
      { name: "Depression", Low: depLow, Moderate: depMod, High: depHigh },
      { name: "Anxiety", Low: anxLow, Moderate: anxMod, High: anxHigh },
      { name: "Sleep Deficit", Low: slpLow, Moderate: slpMod, High: slpHigh },
    ];
  }, [predictionsList]);

  const filteredPredictions = useMemo(() => {
    if (!searchQuery) return predictionsList;
    return predictionsList.filter((p) =>
      p.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [predictionsList, searchQuery]);

  const COLORS = {
    Low: "oklch(0.78 0.16 165)",
    Moderate: "oklch(0.7 0.15 50)",
    High: "oklch(0.62 0.22 27)",
  };

  if (loading) {
    return (
      <section className="pt-24 pb-16 px-4 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard from MongoDB...</p>
      </section>
    );
  }

  if (error && usersList.length === 0 && predictionsList.length === 0) {
    return (
      <section className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <div className="glass p-8 rounded-2xl border border-destructive/30 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <h2 className="font-display text-xl font-semibold">Failed to connect to API</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border border-border bg-card shadow-soft hover:bg-muted/80 transition cursor-pointer disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-16 px-4 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Administrative Control Panel
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground mt-1">
            System Analytics & Users
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor mental health predictions, manage credentials, and audit security logs.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border border-border bg-card shadow-soft hover:bg-muted/80 transition cursor-pointer self-start disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Refresh Database
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass p-5 rounded-2xl border border-border/40 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Users</span>
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display">{stats.totalUsers}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Active registrations</p>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-border/40 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Runs</span>
            <span className="p-2 rounded-xl bg-mint/10 text-mint-foreground">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display">{stats.totalPredictions}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Calculations run</p>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-border/40 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Avg Depression</span>
            <span className="p-2 rounded-xl bg-destructive/10 text-destructive">
              <Brain className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display">{stats.avgDep}%</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Risk probability</p>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-border/40 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Avg Anxiety</span>
            <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Heart className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display">{stats.avgAnx}%</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Somatic responses</p>
          </div>
        </div>

        <div className="glass p-5 rounded-2xl border border-border/40 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Avg Sleep Deficit</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Moon className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display">{stats.avgSleep}%</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Disruption Index</p>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border border-border/60 shadow-elegant">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-display font-semibold text-base text-foreground">
            Risk Severity Distribution (Predictions Breakdown)
          </h2>
        </div>
        <div className="h-[280px] w-full">
          {predictionsList.length === 0 ? (
            <div className="h-full flex items-center justify-center border border-dashed border-border rounded-xl bg-muted/20">
              <p className="text-sm text-muted-foreground">
                No prediction logs available to visualize.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                    color: "var(--foreground)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="Low" fill={COLORS.Low} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Moderate" fill={COLORS.Moderate} radius={[4, 4, 0, 0]} />
                <Bar dataKey="High" fill={COLORS.High} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 glass p-5 rounded-2xl border border-border/60 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Registered Users
            </h2>
            <span className="text-xs bg-muted border border-border px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
              {usersList.length} Accounts
            </span>
          </div>

          <div className="overflow-x-auto border border-border/40 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border/40 text-muted-foreground">
                  <th className="p-3 font-semibold">User Details</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {usersList.map((user) => (
                  <tr key={user.email} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-[10px] text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleRole(user.email, user.role)}
                        disabled={actionLoading === `role-${user.email}`}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer border hover:opacity-80 transition disabled:opacity-50 ${
                          user.role === "admin"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}
                        title="Click to toggle role"
                      >
                        {actionLoading === `role-${user.email}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : user.role === "admin" ? (
                          <ShieldAlert className="w-3 h-3" />
                        ) : (
                          <Users className="w-3 h-3" />
                        )}
                        {user.role}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.email)}
                        disabled={actionLoading === `user-${user.email}`}
                        className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/5 transition cursor-pointer disabled:opacity-50"
                        title="Delete User Account"
                      >
                        {actionLoading === `user-${user.email}` ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserX className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-7 glass p-5 rounded-2xl border border-border/60 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              All Predictions Log
            </h2>
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 text-muted-foreground/60 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search by Gmail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-full sm:w-48 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-ring transition placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-border/40 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border/40 text-muted-foreground">
                  <th className="p-3 font-semibold">User / Date</th>
                  <th className="p-3 font-semibold">Vitals Summary</th>
                  <th className="p-3 font-semibold">Risks</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredPredictions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No prediction logs found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredPredictions.map((pred) => (
                    <tr key={pred.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div className="font-medium text-foreground">{pred.userEmail}</div>
                        <div className="text-[9px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(pred.timestamp).toLocaleDateString()} at{" "}
                          {new Date(pred.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-[10px] text-muted-foreground space-y-0.5">
                          <div>
                            Age: {pred.inputs.age} • HR: {pred.inputs.restingHr} bpm
                          </div>
                          <div>
                            Sleep: {pred.inputs.sleepHours} hrs (Stress: {pred.inputs.stress}
                            /10)
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-semibold">
                            Dep: {pred.results.depression}%
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[9px] font-semibold">
                            Anx: {pred.results.anxiety}%
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[9px] font-semibold">
                            Slp: {pred.results.sleep}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeletePrediction(pred.id)}
                          disabled={actionLoading === `pred-${pred.id}`}
                          className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/5 transition cursor-pointer disabled:opacity-50"
                          title="Remove Log Entry"
                        >
                          {actionLoading === `pred-${pred.id}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
