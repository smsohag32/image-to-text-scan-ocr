import Main from "@/layouts/Main"
import Login from "@/pages/Authentication/Login/Login"
import ImageToText from "@/pages/ImageToText/ImageToText"
import NotFound from "@/pages/NotFound/NotFound"
import { createBrowserRouter } from "react-router-dom"


export const router = createBrowserRouter([
   {
      path: "/",
      element: <Main />,
      children: [
         {
            path: "/",
            element: <ImageToText />
         },

      ]

   },
   {
      path: "*",
      element: <NotFound />
   }
])

