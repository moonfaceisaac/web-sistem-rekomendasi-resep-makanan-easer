import { useState, useRef } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import ConfirmModal from "../../components/common/Modal";
import { useEffect } from "react";
import {
  getRecipes,
  updateRecipe,
  getRecipeDetail,
  createRecipe,
  deleteRecipe,
} from "../../services/adminService";
import Pagination from "../../components/common/Pagination";
import DynamicListInput from "../../components/common/DynamicListInput";

function RecipeFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || {
      title: "",
      ingredients: [""],
      instructions: [""],

      calories: "",
      protein: "",
      fat: "",
      carbohydrates: "",

      image: null,
    },
  );
  useEffect(() => {
    if (initial) {
      setForm(initial);
    }
  }, [initial]);
  const fileInputRef = useRef(null);
  const isEdit = !!initial;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-extrabold text-lg mb-4 uppercase">
          {isEdit ? "Edit Recipe" : "Add Recipe"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Recipe Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Recipe Title"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <DynamicListInput
                label="Ingredients"
                items={form.ingredients}
                setItems={(items) =>
                  setForm({
                    ...form,
                    ingredients: items,
                  })
                }
                placeholder="Ingredient"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Nutritions
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs text-gray-500 mb-1 block">
                  calories
                </label>
                <input
                  type="number"
                  placeholder="Calories"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.calories}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      calories: e.target.value,
                    })
                  }
                />
                <label className="text-xs text-gray-500 mb-1 block">
                  protein
                </label>
                <input
                  type="number"
                  placeholder="Protein (g)"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.protein}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      protein: e.target.value,
                    })
                  }
                />
                <label className="text-xs text-gray-500 mb-1 block">fat</label>
                <input
                  type="number"
                  placeholder="Fat (g)"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.fat}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fat: e.target.value,
                    })
                  }
                />
                <label className="text-xs text-gray-500 mb-1 block">kabo</label>
                <input
                  type="number"
                  placeholder="Carbohydrates (g)"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  value={form.carbohydrates}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      carbohydrates: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <DynamicListInput
                label="Instructions"
                items={form.instructions}
                setItems={(items) =>
                  setForm({
                    ...form,
                    instructions: items,
                  })
                }
                placeholder="Step"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Image</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 bg-gray-50 truncate">
                {form.image ? "Image selected" : "No image"}
              </div>
              <button
                type="button"
                onClick={() => {}}
                className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-700 transition shrink-0"
              >
                Take a Picture
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-700 transition shrink-0"
              >
                Browse
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-gray-300 text-gray-600 text-sm px-6 py-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
            >
              {isEdit ? "Save Changes" : "Create Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageRecipesPage() {
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [recipes, setRecipes] = useState([]);

  async function fetchRecipes() {
    try {
      const data = await getRecipes(query, currentPage, 10);

      setRecipes(data.recipes);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchRecipesDetail() {
    try {
      const data = await getRecipeDetail();
      setRecipes(data.recipes);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchRecipes();
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, currentPage]);

  const handleSave = async (form) => {
    try {
      const payload = {
        title: form.title,

        ingredients: form.ingredients.filter((item) => item.trim() !== ""),

        nutritions: {
          calories: {
            amount: Number(form.calories || 0),
            unit: "kcal",
          },

          protein: {
            amount: Number(form.protein || 0),
            unit: "g",
          },

          fat: {
            amount: Number(form.fat || 0),
            unit: "g",
          },

          carbohydrates: {
            amount: Number(form.carbohydrates || 0),
            unit: "g",
          },
        },

        // cookingDirections: {
        //   directions: form.instructions,
        // },
        // cookingDirections: {
        //   steps: form.instructions.filter(Boolean),
        // },
        cookingDirections: {
          steps: form.instructions.filter((item) => item.trim() !== ""),
        },
      };

      if (modal.mode === "add") {
        await createRecipe(payload);
      }

      if (modal.mode === "edit") {
        await updateRecipe(modal.recipe.recipe_id, payload);
      }

      await fetchRecipes();

      setModal(null);
    } catch (err) {
      console.log(err);

      alert("Invalid nutrition JSON. Check the Nutritions field.");
    }
  };
  const handleEdit = async (recipeId) => {
    try {
      const data = await getRecipeDetail(recipeId);

      setModal({
        mode: "edit",
        recipe: {
          recipe_id: data.recipe.recipe_id,

          title: data.recipe.title || "",

          ingredients: Array.isArray(data.recipe.ingredients)
            ? data.recipe.ingredients
            : [""],

          instructions: Array.isArray(data.recipe.cookingDirections?.steps)
            ? data.recipe.cookingDirections.steps
            : [""],

          calories: data.recipe.nutritions?.calories?.amount || "",

          protein: data.recipe.nutritions?.protein?.amount || "",

          fat: data.recipe.nutritions?.fat?.amount || "",

          carbohydrates: data.recipe.nutritions?.carbohydrates?.amount || "",

          image: data.recipe.imageUrl || null,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRecipe(deleteTarget.recipe_id);

      setRecipes(recipes.filter((r) => r.recipe_id !== deleteTarget.recipe_id));

      setDeleteTarget(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  };
  return (
    <AdminLayout>
      {modal && (
        <RecipeFormModal
          initial={modal.recipe}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message="Are you sure you want to delete this Recipe?"
          title={deleteTarget.title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">All Recipes</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Find your Recipe"
              value={query}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
          <button
            onClick={() =>
              setModal({
                mode: "add",

                recipe: {
                  title: "",
                  ingredients: [""],
                  instructions: [""],

                  calories: "",
                  protein: "",
                  fat: "",
                  carbohydrates: "",

                  image: null,
                },
              })
            }
            className="flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Recipe
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-left">
              <th className="py-2 px-3 font-medium w-12">ID</th>
              <th className="py-2 px-3 font-medium">Recipe</th>
              <th className="py-2 px-3 font-medium text-center w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr
                key={recipe.recipe_id}
                className="border-b border-gray-50 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-3 text-gray-400">{recipe.recipe_id}</td>
                <td className="py-3 px-3 text-gray-700">{recipe.title}</td>
                <td className="py-3 px-3">
                  <div className="flex flex-col gap-1 items-center">
                    <button
                      onClick={() => handleEdit(recipe.recipe_id)}
                      className="w-full bg-gray-900 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-gray-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(recipe)}
                      className="w-full bg-gray-900 text-white text-xs px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {recipes.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-gray-300 text-sm"
                >
                  No recipes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
