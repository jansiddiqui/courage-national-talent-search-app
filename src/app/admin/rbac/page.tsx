"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Shield, Users, Plus, RefreshCw, CheckCircle, AlertCircle, Key, UserCheck } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface Permission {
  id: string;
  key: string;
  description: string;
}

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export default function RbacPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Create role form
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [creatingRole, setCreatingRole] = useState(false);

  // Assign role form
  const [assignAdminId, setAssignAdminId] = useState("");
  const [assignRoleName, setAssignRoleName] = useState("");
  const [assigning, setAssigning] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/rbac");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRoles(data.roles || []);
      setPermissions(data.permissions || []);
      setAdmins(data.admins || []);
    } catch (e: any) {
      setError(e.message || "Failed to load RBAC data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    setCreatingRole(true);
    try {
      const res = await fetch("/api/admin/rbac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_role", name: newRoleName.trim(), description: newRoleDesc.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Role created successfully!");
        setShowCreateRole(false);
        setNewRoleName("");
        setNewRoleDesc("");
        fetchData();
      } else {
        showToast(data.message || "Failed to create role.");
      }
    } catch (e: any) {
      showToast(e.message || "Network error.");
    } finally {
      setCreatingRole(false);
    }
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignAdminId.trim() || !assignRoleName.trim()) return;
    setAssigning(true);
    try {
      const res = await fetch("/api/admin/rbac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "assign_role", adminId: assignAdminId.trim(), roleName: assignRoleName.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Role assigned successfully!");
        setAssignAdminId("");
        setAssignRoleName("");
        fetchData();
      } else {
        showToast(data.message || "Failed to assign role.");
      }
    } catch (e: any) {
      showToast(e.message || "Network error.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Shield size={20} className="text-blue-800" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-800">Role-Based Access Control</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Manage Roles & Permissions</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/50 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 space-y-8">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-blue-800 text-white rounded-xl shadow-lg text-sm font-medium">
            {toast}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Actions Row */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Key size={18} className="text-blue-800" />
                Roles ({roles.length})
              </h2>
              <button
                onClick={() => setShowCreateRole(true)}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                Create Role
              </button>
            </div>

            {/* Create Role Modal */}
            {showCreateRole && (
              <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md space-y-4">
                  <h3 className="font-bold text-slate-800 text-base">Create New Role</h3>
                  <form onSubmit={handleCreateRole} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Role Name</label>
                      <input
                        type="text"
                        value={newRoleName}
                        onChange={e => setNewRoleName(e.target.value)}
                        placeholder="e.g., CONTENT_EDITOR"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Description</label>
                      <input
                        type="text"
                        value={newRoleDesc}
                        onChange={e => setNewRoleDesc(e.target.value)}
                        placeholder="Role description..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={creatingRole || !newRoleName.trim()}
                        className="flex-1 py-2 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                      >
                        {creatingRole ? "Creating..." : "Create Role"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateRole(false)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Roles Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-slate-400 text-sm">
                        No roles found. Create the first role above.
                      </td>
                    </tr>
                  ) : (
                    roles.map(role => (
                      <tr key={role.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-bold">
                            <Shield size={11} />
                            {role.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{role.description || "—"}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(role.created_at).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Permissions Table */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <CheckCircle size={18} className="text-blue-800" />
                Permissions ({permissions.length})
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Permission Key</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-8 text-slate-400 text-sm">
                          No permissions defined yet.
                        </td>
                      </tr>
                    ) : (
                      permissions.map(perm => (
                        <tr key={perm.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-mono">{perm.key}</code>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm">{perm.description || "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assign Role Form */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <UserCheck size={18} className="text-blue-800" />
                Assign Role to Admin
              </h2>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <form onSubmit={handleAssignRole} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Admin</label>
                    <select
                      value={assignAdminId}
                      onChange={e => setAssignAdminId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 bg-white"
                    >
                      <option value="">— Select Admin —</option>
                      {admins.map(a => (
                        <option key={a.id} value={a.id}>{a.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Role</label>
                    <select
                      value={assignRoleName}
                      onChange={e => setAssignRoleName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 bg-white"
                    >
                      <option value="">— Select Role —</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={assigning || !assignAdminId || !assignRoleName}
                    className="px-6 py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
                  >
                    {assigning ? "Assigning..." : "Assign Role"}
                  </button>
                </form>
              </div>
            </div>

            {/* Admin Users Table */}
            {admins.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Users size={18} className="text-blue-800" />
                  Admin Users ({admins.length})
                </h2>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map(admin => (
                        <tr key={admin.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-slate-700 font-medium">{admin.email}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                              {admin.role || "admin"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
