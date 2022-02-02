// import express, { Request, Response } from "express";
// const app = express();

// // Parse JSON 
// app.use(express.json());

// app.get("/", (req: Request, res: Response) => {
//     res.json({
//         message: "User Service Microservice"
//     })
// })

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log(`User Service Microservice Server is running on port ${port}`);
// })

import App from './providers/App';

/**
 * Run the Database pool
*/
App.loadDatabase();

/**
 * Run the Server on Clusters
*/
App.loadServer();