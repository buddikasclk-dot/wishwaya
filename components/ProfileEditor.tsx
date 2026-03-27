import React, { useEffect, useState } from 'react';
import { UserProfile } from '../src/types';

interface ProfileEditorProps {
  initialProfile: UserProfile;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (profile: Pick<UserProfile, 'name' | 'gender' | 'dob' | 'birthTime' | 'city'>) => Promise<void>;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  initialProfile,
  loading,
  error,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    name: initialProfile.name,
    gender: initialProfile.gender,
    dob: initialProfile.dob,
    birthTime: initialProfile.birthTime,
    city: initialProfile.city,
  });

  useEffect(() => {
    setForm({
      name: initialProfile.name,
      gender: initialProfile.gender,
      dob: initialProfile.dob,
      birthTime: initialProfile.birthTime,
      city: initialProfile.city,
    });
  }, [initialProfile]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 zen-shadow border border-gray-100 space-y-6 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="space-y-2 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Edit Profile</p>
          <h3 className="sinhala text-xl font-black text-gray-800">ඔබගේ විස්තර යාවත්කාලීන කරන්න</h3>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
            Saving will update your local app data and your Firebase cloud profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em]">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em]">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs font-medium"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em]">City</label>
              <input
                type="text"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em]">Birth Date</label>
              <input
                type="date"
                name="dob"
                required
                value={form.dob}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 ml-1 uppercase tracking-[0.15em]">Birth Time</label>
              <input
                type="time"
                name="birthTime"
                required
                value={form.birthTime}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-green-100 focus:bg-white transition-all outline-none text-xs font-medium"
              />
            </div>
          </div>

          {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save details'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;
