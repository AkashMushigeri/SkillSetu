'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/CollegeContext';
import { Building, Globe, Mail, Phone, MapPin, Edit, CheckCircle2, Award, Users, ShieldCheck, X } from 'lucide-react';

export default function CollegeProfilePage() {
  const { profile, updateProfile } = useCollege();
  const [isEditing, setIsEditing] = useState(false);

  const [institutionName, setInstitutionName] = useState(profile.institutionName);
  const [location, setLocation] = useState(profile.location);
  const [address, setAddress] = useState(profile.address);
  const [website, setWebsite] = useState(profile.website);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [principalName, setPrincipalName] = useState(profile.principalName);
  const [naacGrade, setNaacGrade] = useState(profile.naacGrade);
  const [nirfRank, setNirfRank] = useState(profile.nirfRank);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      institutionName,
      location,
      address,
      website,
      email,
      phone,
      principalName,
      naacGrade,
      nirfRank,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-brand-dark via-brand-teal to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={profile.logoUrl}
            alt={profile.institutionName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-emerald-400/80 shadow-2xl shrink-0 bg-white"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{profile.institutionName}</h1>
              <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-300" title="Accredited College">
                <ShieldCheck className="w-5 h-5" />
              </span>
            </div>
            <p className="text-xs text-teal-100 font-semibold">{profile.location} &bull; ID: {profile.collegeId}</p>
            <p className="text-xs text-emerald-300 font-bold">{profile.naacGrade} &bull; {profile.nirfRank}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/20 shadow-xs transition-colors"
        >
          <Edit className="w-4 h-4 text-emerald-300" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Institutional Contact & Metadata */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
            <Building className="w-5 h-5 text-brand-emerald" />
            Institutional Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Official Website</span>
              <a href={profile.website} target="_blank" rel="noreferrer" className="font-bold text-brand-teal hover:underline">
                {profile.website}
              </a>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Official Email</span>
              <span className="font-bold text-slate-900">{profile.email}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Contact Phone</span>
              <span className="font-bold text-slate-900">{profile.phone}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Principal</span>
              <span className="font-bold text-slate-900">{profile.principalName}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 block text-[10px]">Campus Address</span>
            <span className="font-bold text-slate-800">{profile.address}</span>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-wider">Active Academic Departments</span>
            <div className="flex flex-wrap gap-2">
              {profile.departments.map((d) => (
                <span key={d} className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Placement Officer & Key Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Placement &amp; Training Lead
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={profile.placementOfficer.avatar}
                alt={profile.placementOfficer.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <div className="text-xs">
                <p className="font-bold text-slate-900 text-sm">{profile.placementOfficer.name}</p>
                <p className="text-emerald-700 font-medium">{profile.placementOfficer.title}</p>
                <p className="text-slate-500 mt-1">{profile.placementOfficer.email}</p>
                <p className="text-slate-500">{profile.placementOfficer.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500">Total Enrolled Students</span>
              <span className="font-bold text-slate-900 font-mono">{profile.totalStudents}</span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500">Active Industry Partners</span>
              <span className="font-bold text-emerald-700 font-mono">{profile.industryPartnersCount} Partners</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Edit College Profile</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institution Name</label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Principal Name</label>
                  <input
                    type="text"
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Campus Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-brand-emerald to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
