# ScholarAid: A Scholarship Management System

## Project Overview
ScholarAid is a web application that combines Django to function as the backend and React to function as the frontend. To run the project, you will need to set up the Python environment for the backend and the Node.js environment for the frontend.

---

## Prerequisites
Ensure you have the following installed on your system:

1. **Python** (version 3.8 or higher)
2. **pipenv** (for managing Python dependencies)
3. **Node.js** (version 16 or higher)
4. **npm** (comes with Node.js)

---

## Backend Setup (Django)

1. Navigate to the backend directory:
    ```bash
    cd backend
    ```

2. Install dependencies using Pipenv:
    ```bash
    pipenv install
    ```

3. Activate the virtual environment:
    ```bash
    pipenv shell
    ```

4. Run migrations:
    ```bash
    python manage.py migrate
    ```

5. Start the Django development server:
    ```bash
    python manage.py runserver
    ```

The backend server should now be running at `http://127.0.0.1:8000/`.

---

## Frontend Setup (React)

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2. Install dependencies using npm:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm start
    ```

The frontend server should now be running at `http://localhost:3000/`.

---

## Running the Full Project

1. Open two terminal windows or tabs.
2. In one terminal, run the Django backend following the instructions in the **Backend Setup** section.
3. In the other terminal, run the React frontend following the instructions in the **Frontend Setup** section.

---

## Notes

- Make sure both the backend and frontend servers are running simultaneously.
- If you encounter any issues, verify that all dependencies are installed correctly and the correct versions of Python and Node.js are being used.

---

## Additional Commands

### Backend
- Create a superuser for the Django admin panel to access the scholarship management system functionaities and features:
    ```bash
    python manage.py createsuperuser
    ```
### Frontend
- Build the React app for production:
    ```bash
    npm run build
    ```
---

## License

This project is licensed under the [MIT License](LICENSE).

