# Project Setup and Initial Planning

The project was initially planned with **two separate repositories**: one for the backend and another for the frontend.  
The first step was to prepare the environment and set up both repositories before starting development.

Later, I reconsidered that structure and decided to switch to a **monorepository approach**, allowing both the frontend and backend to live in the same repository. My main concern then became finding an efficient way to integrate both applications in one place.

Fortunately, I found a library that supported managing both applications within the same repository, so I decided to move forward with that solution.

## AI-Assisted Project Initialization

To get a clearer starting point for the project, I used AI assistance by sending the following prompt:

> Hola, soy un developer con no mucho conocimiento en NestJS pero tengo que hacer lo siguiente...
>
> **User Story:**  
> "Como developer, quiero acceder a mi 'Cartelera de Conocimiento' para ver los últimos videos. No quiero ver el payload crudo y lleno de basura de datos que manda YouTube; quiero que nuestro sistema actúe como un colador. Necesito que me entregue un JSON limpio con solo la miniatura, el título, el autor, el tiempo relativo de publicación y un 'Nivel de Hype' calculado por nosotros. En la pantalla, el video que tenga el mayor Hype debe mostrarse como la 'Joya de la Corona', destacando y diferenciándose visualmente del resto de los mortales."
>
> **Backend (NestJS):**
> - Create a `GET /api/videos` endpoint that reads the attached JSON file (simulating an external provider response).
> - Calculate the **Hype Level** using the formula:  
>   `(likes + comments) / views`
> - Apply business rules:
>   - If the video title contains the word **"Tutorial"** (case insensitive), multiply the final hype by **2**
>   - If comments are disabled (comments property is missing), hype is automatically **0**
> - Transform the publication date into a user-friendly relative format (e.g. `"2 months ago"`, `"5 days ago"`)
> - **Restriction:** Do not use date libraries such as `moment.js` or `date-fns`; use native JavaScript only.
>
> **Frontend (ReactJS):**
> - Consume the NestJS endpoint
> - Display the videos in a grid layout
> - Highlight the video with the highest hype level as **"The Crown Jewel"**
> - Handle loading and error states properly

The AI-generated files provided a useful starting structure, which I then customized according to the project requirements.

## Project Customization and Improvements

After generating the base files, I began modifying the implementation to better fit the project goals. One of the main improvements I introduced was related to **security**.

Although security measures were not explicitly required, I decided to implement some additional validations as an extra enhancement, aiming to make the project closer to what a real-world application would require.

Once the structure was defined, I set up the project using:

- **NestJS CLI** for the backend
- **React + Vite + TypeScript** for the frontend
- **TypeScript** in both applications for type safety and maintainability

This setup allowed me to establish a clean foundation for both the backend and frontend while keeping the code organized within the monorepository structure.
