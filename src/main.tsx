import * as React from "react"
import { createRoot } from "react-dom/client"
import Spacbar from "./spacbar"

const el = document.getElementById("root")
if (el) createRoot(el).render(<Spacbar />)
