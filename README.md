# Ajira Global Platform

## Overview
Ajira Global is a modern web application connecting job seekers with opportunities. Built with React and Python, it provides a seamless experience for both job seekers and employers.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.x or higher)
- Python (v3.8 or higher)
- npm (v8.x or higher)
- pip (v21.x or higher)

### Frontend Setup

1. Clone the repository
```bash
git clone https://github.com/your-username/ajiraglobal.git
cd ajiraglobal
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Start the development server
```bash
npm start
```
The application will be available at http://localhost:3000

### Backend Setup

1. Create and activate virtual environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

2. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

3. Set up environment variables
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

4. Run migrations
```bash
python manage.py migrate
```

5. Start the backend server
```bash
python manage.py runserver
```
The API will be available at http://localhost:8000

## 📦 Dependencies

### Frontend Dependencies
```bash
npm install @emotion/react@11.14.0
npm install @emotion/styled@11.14.0
npm install @mui/icons-material@6.4.7
npm install @mui/material@6.4.7
npm install react@18.2.0
npm install react-dom@18.2.0
npm install react-router-dom@7.2.0
```

### Backend Dependencies
```bash
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install python-dotenv
pip install psycopg2-binary
pip install pillow
pip install django-rest-knox
```

## 🛠️ Development

### Running Tests

Frontend Tests:
```bash
cd frontend
npm test
```

Backend Tests:
```bash
cd backend
python manage.py test
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

Backend:
```bash
cd backend
python manage.py collectstatic
```

## 📝 Available Scripts

### Frontend Scripts
- `npm start` - Starts development server
- `npm test` - Runs test suite
- `npm run build` - Builds for production
- `npm run eject` - Ejects from create-react-app

### Backend Scripts
- `python manage.py runserver` - Starts development server
- `python manage.py migrate` - Runs migrations
- `python manage.py createsuperuser` - Creates admin user
- `python manage.py collectstatic` - Collects static files

## 🔧 Configuration

### Environment Variables

Frontend (.env):
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
```

Backend (.env):
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 🌐 API Documentation

API documentation is available at `/api/docs/` when running the backend server.

## 🔒 Security

- Ensure all environment variables are properly set
- Never commit .env files
- Keep dependencies updated
- Use strong passwords for database and admin accounts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 👥 Team

- Project Manager: [John Muthee](https://github.com/mutheejj)
- Lead Developer: [johnmuthee](https://github.com/johnmuthee)
- Frontend Developer: [johnmuthee](https://github.com/johnmuthee)
- Backend Developer: [johnmuthee](https://github.com/johnmuthee)
- UI/UX Designer: [johnmuthee](https://github.com/johnmuthee)

## 📞 Support

For support, email support@ajiraglobal.com or join our Slack channel.

## 🔄 Version History

* 0.1.0
    * Initial Release
    * Basic authentication and job listing features

## 🔮 Roadmap

- [ ] Advanced search functionality
- [ ] Real-time chat feature
- [ ] Mobile application
- [ ] AI-powered job matching
- [ ] Integration with popular job boards