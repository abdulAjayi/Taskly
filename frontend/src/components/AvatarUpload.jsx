import { useEffect, useState } from "react";

export default function AvatarUpload({ currentAvatar, name, onUpload }) {
  const [preview, setPreview] = useState(currentAvatar);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(
    () => () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  useEffect(() => {
    setPreview(currentAvatar);
  }, [currentAvatar]);
  function select(event) {
    const next = event.target.files?.[0];
    if (!next) return;
    if (!next.type.startsWith("image/"))
      return setError("Please choose an image file.");
    setFile(next);
    setPreview(URL.createObjectURL(next));
    setError("");
  }
  async function submit(event) {
    event.preventDefault();
    if (!file) return setError("Choose an image before uploading.");
    setBusy(true);
    setError("");
    try {
      await onUpload(file);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="avatar-form">
      <div className="avatar-preview">
        {preview ? (
          <img src={preview} alt="Avatar preview" />
        ) : (
          <div className="avatar-placeholder" aria-label="No avatar uploaded">
            <strong>{name?.trim().charAt(0).toUpperCase() || "?"}</strong>
            <span>No avatar</span>
          </div>
        )}
      </div>
      <label className="file-input">
        Choose image
        <input type="file" accept="image/*" onChange={select} />
      </label>
      <button disabled={busy}>{busy ? "Uploading…" : "Upload avatar"}</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
