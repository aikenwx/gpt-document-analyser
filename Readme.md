## About
- This is a web application that parses user submitted text and generates a summary of the text using the GPT-3 model from OpenAI
- Users can submit additional queries regarding their documents appart from the summary as the context of the documents is maintained
- The backend is stateless and the context is maintained using the frontend local storage

## Steps to run with Docker compose
- Rename the `.env.example` files to `.env` in both backend and frontend and frontend directories
- Replace the `OPENAI_API_KEY` in `backend/app/.env` with your openai api key
- Run `docker-compose up -d --build`
- Frontend will be available at `http://localhost:3000`
- Backend will be available at `http://localhost:8000`