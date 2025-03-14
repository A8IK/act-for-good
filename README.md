**Project Overview:**
This project is kinda social platform to help others. In this project every user could see the News feed of other users post and if the user want to create a help post and want to comment on others user post user must need to login. So user can sign up. After signup user could see the other users post and comment and also create a help post for others.

**Technologies used:**
  Frontend: ReactJS, Tailwind CSS
  Backend: NodeJs, ExpressJs
  Database: MongoDB
  Authentication: JSON Web Tokens (JWT)
  API Testing: Postman
    
**Features:**
User Authentication: Users can sign up, log in, and access protected routes.
Create Events: Authenticated users can create new events with a title, description, location, urgency, and date.
Filter Events: Users can filter events by urgency, date, and location.
Pagination: Events are displayed with pagination for easy navigation.
Comments System: Users can leave comments on event pages.
Real-Time Updates: Events and comments update dynamically.

**Database Schema:**
__For events and comment schema:__
const eventSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: String, required: true},
    eventDate: {type: Date, required: true},
    urgency: { type: String, required: true },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    userLocalTime: { type: String, required: true }, 
    comments: [
          {
              user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
              text: String,
              createdAt: { type: Date, default: Date.now },
          },
      ],
},{ timestamps: true })

For user schema:
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    supportType: { type: String, required: true },
  },
  { timestamps: true }
);

**Setup Instructions:**
1. Clone the Repository: git clone https://github.com/A8IK/act-for-good.git
2. Install Dependencies: npm install
3. Setup Environment Variables:
.env file:
PORT=9000
MONGODB_URI=mongodb+srv://atikul2585:12345@act-for-good.2hefo.mongodb.net/?retryWrites=true&w=majority&appName=act-for-good
JWT_SECRET=your_secret_key
4.Run the Server to type in your terminal: __npm start__ and for frontend __npm run dev__
