import { useState, useRef, useEffect } from "react";
import UserLayout from "../../components/layout/UserLayout";
import ProfileLayout from "../../components/layout/ProfileLayout";
import {
  getUserProfile,
  editUserProfile,
  updateUserProfilePhoto,
} from "../../services/userService";
import { useToast } from "../../hooks/useToast";
import { getFriendlyApiError } from "../../utils/httpError";
import { isValidEmail } from "../../utils/validation";
import { useAuthStore } from "../../store/authStore";

const EMPTY_USER = {
  fullname: "",
  email: "",
  username: "",
  placeOfBirth: "",
  dateOfBirth: "",
  gender: "",
  avatar: null,
};

function getAvatarSrc(photo) {
  if (!photo) return null;

  if (
    photo.startsWith("data:image/") ||
    photo.startsWith("http://") ||
    photo.startsWith("https://")
  ) {
    return photo;
  }

  return `${import.meta.env.VITE_API_URL}${photo}`;
}

function ChangePhotoModal({ onClose, onBrowse, avatar, uploading }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-36 h-36 rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
          {getAvatarSrc(avatar) ? (
            <img
              src={getAvatarSrc(avatar)}
              alt="avatar-preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              className="w-24 h-24 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onBrowse}
            disabled={uploading}
            className="flex-1 bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Browse"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_USER);
  const [savedForm, setSavedForm] = useState(EMPTY_USER);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState({});
  const setProfilePhoto = useAuthStore((s) => s.setProfilePhoto);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEdit = () => {
    setSavedForm(form);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(savedForm);
    setEditing(false);
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email.trim())) {
      nextErrors.email = "Please enter a valid email format.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || submitting) {
      return;
    }

    const payload = {
      namaLengkap: form.fullname,
      username: form.username.trim(),
      email: form.email.trim(),
      tempatLahir: form.placeOfBirth,
      tanggalLahir: form.dateOfBirth,
      jenisKelamin: form.gender,
    };

    setSubmitting(true);

    try {
      await editUserProfile({
        payload,
      });

      setSavedForm(form);
      setEditing(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      const message = err.response?.data?.message || "";
      const lowered = message.toLowerCase();

      if (lowered.includes("username")) {
        setErrors((prev) => ({ ...prev, username: message }));
      }

      if (lowered.includes("email")) {
        setErrors((prev) => ({ ...prev, email: message }));
      }

      toast.error(getFriendlyApiError(err, "Failed to update profile"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBrowse = () => {
    setShowPhotoModal(false);
    fileInputRef.current?.click();
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    setUploadingPhoto(true);

    try {
      const photoBase64 = await toBase64(file);
      const result = await updateUserProfilePhoto(photoBase64);
      const photo = result.user?.photo || photoBase64;

      setForm((prev) => ({ ...prev, avatar: photo }));
      setSavedForm((prev) => ({ ...prev, avatar: photo }));
      setProfilePhoto(photo);
      toast.success("Profile photo updated successfully.");
    } catch (err) {
      toast.error(getFriendlyApiError(err, "Failed to upload profile photo"));
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
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
        setProfilePhoto(profileData.avatar);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [setProfilePhoto]);

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
            avatar={form.avatar}
            uploading={uploadingPhoto}
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
                  {getAvatarSrc(form.avatar) ? (
                    <img
                      src={getAvatarSrc(form.avatar)}
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
                  disabled={uploadingPhoto}
                  className="flex items-center gap-1 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" />
                  </svg>
                  {uploadingPhoto ? "Uploading..." : "Change"}
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
                    disabled={!editing || submitting}
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
                    disabled={!editing || submitting}
                    placeholder="Username"
                    className={`${inputClass} ${errors.username ? "border-red-400" : ""}`}
                  />
                  {errors.username && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    E-Mail
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editing || submitting}
                    placeholder="username@gmail.com"
                    className={`${inputClass} ${errors.email ? "border-red-400" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
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
                  disabled={!editing || submitting}
                  placeholder="Indonesia"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={!editing || submitting}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  disabled={!editing || submitting}
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
                    disabled={submitting}
                    className="border border-gray-300 text-gray-600 text-sm px-6 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gray-900 text-white text-sm px-6 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Saving..." : "Save"}
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
