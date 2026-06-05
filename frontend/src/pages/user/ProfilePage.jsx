import { useState, useRef, useEffect } from "react";
import UserLayout from "../../components/layout/UserLayout";
import ProfileLayout from "../../components/layout/ProfileLayout";
// import { useState, useRef, useEffect } from "react";
import { getUserProfile, editUserProfile } from "../../services/userService";

// const DUMMY_USER = {
//   fullname: "",
//   username: "",
//   email: "",
//   placeOfBirth: "Indonesia",
//   dateOfBirth: "01 Januari 2001",
//   gender: "Male",
//   avatar: null,
// }
const EMPTY_USER = {
  fullname: "",
  email: "",
  username: "",
  placeOfBirth: "",
  dateOfBirth: "",
  gender: "",
  avatar: null,
};

function ChangePhotoModal({ onClose, onBrowse }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-36 h-36 rounded-full bg-gray-900 flex items-center justify-center">
          <svg
            className="w-24 h-24 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Take a Picture
          </button>
          <button
            onClick={onBrowse}
            className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Browse
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  // const [form, setForm] = useState(DUMMY_USER)
  // const [savedForm, setSavedForm] = useState(DUMMY_USER)
  const [form, setForm] = useState(EMPTY_USER);
  const [savedForm, setSavedForm] = useState(EMPTY_USER);
  const [loading, setLoading] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleEdit = () => {
    setSavedForm(form);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(savedForm);
    setEditing(false);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setSavedForm(form);
  //   setEditing(false);
  //   // TODO: userService.updateProfile(form)
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      namaLengkap: form.fullname,
      username: form.username,
      email: form.email,
      tempatLahir: form.placeOfBirth,
      tanggalLahir: form.dateOfBirth,
      jenisKelamin: form.gender,
    };
    console.log(payload);

    try {
      await editUserProfile({
        payload,
      });

      setSavedForm(form);
      setEditing(false);

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);

      alert("Failed to update profile");
    }
  };

  const handleBrowse = () => {
    setShowPhotoModal(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm({ ...form, avatar: url });
  };
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();

        const profileData = {
          fullname: data.user.namaLengkap || "",
          username: data.user.username || "",
          email: data.user.email || "",
          placeOfBirth: data.user.tempatLahir || "",
          dateOfBirth: data.user.tanggalLahir
            ? data.user.tanggalLahir.split("T")[0]
            : "",
          gender: data.user.jenisKelamin || "",
          avatar: data.user.photo || null,
        };

        setForm(profileData);
        setSavedForm(profileData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);
  const inputClass = `w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400
    ${editing ? "bg-white text-gray-800" : "bg-gray-50 text-gray-400"}`;
  if (loading) {
    return (
      <UserLayout>
        <ProfileLayout>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            Loading profile...
          </div>
        </ProfileLayout>
      </UserLayout>
    );
  }
  return (
    <UserLayout>
      <ProfileLayout>
        {showPhotoModal && (
          <ChangePhotoModal
            onClose={() => setShowPhotoModal(false)}
            onBrowse={handleBrowse}
          />
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-6 mb-4">
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-14 h-14 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="flex items-center gap-1 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" />
                  </svg>
                  Change
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Fullname
                  </label>
                  <input
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Fullname"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Username
                  </label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Username"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    E-Mail
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="username@gmail.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Place of Birth
                </label>
                <input
                  name="placeOfBirth"
                  value={form.placeOfBirth}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Indonesia"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Date of Birth
                </label>
                {/* <input
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="01 Januari 2001"
                  className={inputClass}
                /> */}
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={!editing}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Gender
                </label>
                {/* <input
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Male"
                  className={inputClass}
                /> */}
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!editing}
                  className={inputClass}
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="border border-gray-300 text-gray-600 text-sm px-6 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gray-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Save
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-gray-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </ProfileLayout>
    </UserLayout>
  );
}
