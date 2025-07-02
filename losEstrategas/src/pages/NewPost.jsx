import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  // Cargar tags existentes
  useEffect(() => {
    fetch("http://localhost:3001/tags")
      .then((res) => res.json())
      .then((data) => setTags(data))
      .catch((err) => console.error("Error al cargar tags:", err));
  }, []);

  const handleCheckboxChange = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return alert("La descripción es obligatoria.");

    try {
      // Crear el post
      const postRes = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          userId: user.id,
          tagIds: selectedTagIds, // CAMBIO CLAVE: usar "tagIds"
        }),
      });

      if (!postRes.ok) {
        const msg = await postRes.text();
        console.error("Error al crear post:", msg);
        throw new Error("No se pudo crear el post");
      }

      const newPost = await postRes.json();

      // Crear imágenes
      for (const url of imageUrls) {
        if (url.trim()) {
          await fetch("http://localhost:3001/postimages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url,
              postId: newPost.id,
            }),
          });
        }
      }

      alert("Publicación creada exitosamente!");
      navigate("/"); // redirige al Home
    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert("Ocurrió un error al crear la publicación.");
    }
  };

  return (
    <div className="container">
      <h2>Crear nueva publicación</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Descripción *</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Imágenes (URLs)</label>
          {imageUrls.map((url, i) => (
            <input
              key={i}
              type="text"
              className="form-control mb-2"
              value={url}
              placeholder={`URL imagen ${i + 1}`}
              onChange={(e) => updateImageUrl(i, e.target.value)}
            />
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={addImageField}>
            + Agregar otra imagen
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Etiquetas disponibles</label>
          <div className="d-flex flex-wrap">
            {tags.map((tag) => (
              <div key={tag.id} className="form-check me-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`tag-${tag.id}`}
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={() => handleCheckboxChange(tag.id)}
                />
                <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                  {tag.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-success">Publicar</button>
      </form>
    </div>
  );
};

export default NewPost;
