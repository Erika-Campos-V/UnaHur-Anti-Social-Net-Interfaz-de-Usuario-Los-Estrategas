import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const NewPost = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState(""); // NUEVO estado para crear una etiqueta

  // Obtener etiquetas desde la API
  useEffect(() => {
    fetch("http://localhost:3001/tags")
      .then(res => res.json())
      .then(data => setTags(data))
      .catch(err => console.error("Error al cargar tags", err));
  }, []);

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
      let tagIds = [...selectedTags]; // Clonamos los tags seleccionados (por id)

      // Si hay nuevo tag, lo creamos primero
      if (newTag.trim()) {
        const newTagRes = await fetch("http://localhost:3001/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTag.trim() })
        });

        if (!newTagRes.ok) throw new Error("No se pudo crear el nuevo tag");

        const createdTag = await newTagRes.json();
        tagIds.push(createdTag.id);
      }

      // Crear el post
      const postRes = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          userId: user.id,
          tags: tagIds
        }),
      });

      if (!postRes.ok) throw new Error("No se pudo crear el post");

      const newPost = await postRes.json();

      // Crear imágenes asociadas
      for (const url of imageUrls) {
        if (url.trim()) {
          await fetch("http://localhost:3001/postimages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url,
              postId: newPost.id
            }),
          });
        }
      }

      alert("Publicación creada exitosamente!");
      navigate("/profile");
    } catch (error) {
      console.error("Error al crear publicación:", error);
      alert("Ocurrió un error al crear el post.");
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
          <label className="form-label">Etiquetas existentes</label>
          <select
            className="form-select"
            multiple
            value={selectedTags}
            onChange={(e) =>
              setSelectedTags(Array.from(e.target.selectedOptions, opt => opt.value))
            }
          >
            {tags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Agregar nueva etiqueta (opcional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: naturaleza, viajes..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success">Publicar</button>
      </form>
    </div>
  );
};

export default NewPost;
