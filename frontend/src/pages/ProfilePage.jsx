import { useState } from "react";
import { useAuthStore } from '../store/useAuthStore'
import { userApi } from "../services/api";
import AvatarUpload from "../components/AvatarUpload";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [message, setMessage] = useState("");
  const [uploadedAt, setUploadedAt] = useState(null);
  const hasAvatar = Boolean(user?.avatar) || uploadedAt !== null;
  const avatar = hasAvatar && user?._id
    ? `${userApi.avatarUrl(user._id)}?v=${uploadedAt || "existing"}`
    : "";
  async function upload(file) {
    setMessage("");
    await userApi.uploadAvatar(token, file);
    setUploadedAt(Date.now());
    setMessage("Avatar uploaded successfully.");
  }
  return (
    <section className="page profile-page">
      <p className="kicker">WORKSPACE / PROFILE</p>
      <h1>Profile</h1>
      <div className="profile-grid">
        <div className="profile-data">
          <dl>
            <div>
              <dt>Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{user.age || "—"}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2>Avatar</h2>
          <AvatarUpload
            currentAvatar={avatar}
            name={user?.name}
            onUpload={upload}
          />
          {message && <p className="success">{message}</p>}
        </div>
      </div>
    </section>
  );
}
