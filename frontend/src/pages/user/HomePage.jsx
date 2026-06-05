// import { useLocation } from "react-router-dom"
// import UserLayout from "../../components/layout/UserLayout"
// import RecipeGrid from "../../components/user/RecipeGrid"

// import { useEffect, useState } from "react"
// import { getRecipes } from "../../services/recipeService"
// const DUMMY = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, title: "Recipe Title" }))

// export default function HomePage() {
//   const location = useLocation()
//   const hasInteraction = location.state?.hasInteraction ?? false

//   return (
//     <UserLayout>
//       <div className="flex flex-col gap-6 h-full">
//         {hasInteraction && (
//           <RecipeGrid title="Recommended for You" recipes={DUMMY} navigateTo="/recipes/recommended" />
//         )}
//         <RecipeGrid title="All Recipes" recipes={DUMMY} navigateTo="/recipes/all" />
//       </div>
//     </UserLayout>
//   )
// }

// export default function HomePage(){
//   const[ recipes, setRecipes ] = useState([])
//     useEffect(()=>{
//       fetchRecipes()
//     },[])

//   async function fetchRecipes(){

//     try{

//       const data=

//       await getRecipes()

//       setRecipes(
//       data
//       )

//     }

//     catch(err){
//       console.log(err)
//       }

//       }

//       return(

//       <div
//       className="
//       grid
//       grid-cols-4
//       gap-4
//       "
//       >

//     {

// recipes.map(

// recipe=>(

// <div

// key={
// recipe.recipe_id
// }

// className="
// border
// rounded
// p-3
// "

// >

// <img

// src={
// recipe.imageUrl
// }

// className="
// w-full
// h-48
// object-cover
// "

// />

// <h2>

// {
// recipe.title
// }

// </h2>

// </div>

// )

// )

// }

// </div>

// )

// }

import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import UserLayout from "../../components/layout/UserLayout";
import RecipeGrid from "../../components/user/RecipeGrid";

import { getRecipes } from "../../services/recipeService";

export default function HomePage() {
  const location = useLocation();

  const hasInteraction = location.state?.hasInteraction ?? false;

  console.log("HomePage rendered")

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  // async function fetchRecipes() {
  //   try {
  //     const data = await getRecipes();

  //     setRecipes(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  async function fetchRecipes() {
    try {
      const data = await getRecipes();

      console.log(data);

      setRecipes(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <UserLayout>
      <div className="flex flex-col gap-6 h-full">
        {hasInteraction && (
          <RecipeGrid
            title="Recommended for You"
            recipes={recipes}
            navigateTo="/recipes/recommended"
          />
        )}

        <RecipeGrid
          title="All Recipes"
          recipes={recipes}
          navigateTo="/recipes/all"
        />
      </div>
    </UserLayout>
  );
}
