import express from 'express';
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { usersRouter } from './routes/users.route';
import { projectsRouter } from './routes/projects.route';
import { tasksRouter } from './routes/tasks.route';
import { commentsRouter } from './routes/comments.route';
import { userProjectRouter } from './routes/usersprojects.route';
import { activityRouter } from './routes/activity.routes';
import templateRoutes from "./routes/template.routes";


export function createApp() {
	const app = express();
	app.use(cors());
	app.use(express.json());

	// Swagger UI
	const openapiPath = path.join(__dirname, "../openapi.yaml");
	const openapiDocument = YAML.load(openapiPath);
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

	app.use("/users", usersRouter);
	app.use("/projects", projectsRouter);
	app.use("/tasks", tasksRouter);
	app.use("/comments", commentsRouter);
	app.use("/usersProjects", userProjectRouter);
	app.use("/activity", activityRouter);
	app.use("/templates", templateRoutes);

	return app;
}
