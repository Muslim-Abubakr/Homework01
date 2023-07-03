"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.port || 5000;
let videos = [{
        "id": 1,
        "title": "string",
        "author": "string",
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": new Date().toISOString(),
        "publicationDate": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        "availableResolutions": ["P144"]
    }, {
        "id": 2,
        "title": "string",
        "author": "string",
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": new Date().toISOString(),
        "publicationDate": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        "availableResolutions": ["P144"]
    }
];
const permissionValues = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
const HTTP_STATUSES = {
    OK200: 200,
    CREATED_201: 201,
    NO_CONTENT: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
};
const parserMiddleware = (0, body_parser_1.default)({});
app.use(parserMiddleware);
app.get('/videos', (req, res) => {
    res.send(videos);
});
app.get('/videos/:id', (req, res) => {
    let foundVideo = videos.find(v => v.id === +req.params.id);
    if (foundVideo) {
        res
            .status(HTTP_STATUSES.OK200)
            .send(foundVideo);
    }
    else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
});
app.delete('/videos/:id', (req, res) => {
    const video = videos.find(v => v.id === +req.params.id);
    if (!video) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    videos = videos.filter(v => v.id !== video.id);
    return res.sendStatus(204);
});
app.delete('/testing/all-data', (req, res) => {
    videos = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = req.body.publicationDate;
    let errorResult = [];
    let video = videos.find(v => v.id === id);
    if (!video) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    if (!title || typeof title !== 'string' || title.trim() || title.length > 40) {
        errorResult.push({
            "message": "Incorrect title",
            "field": "title"
        });
    }
    if (!author || typeof author !== 'string' || author.trim() || author.length > 20) {
        errorResult.push({
            "message": "Incorrect author",
            "field": "author"
        });
    }
    if (minAgeRestriction.length > 18 || minAgeRestriction < 1 || typeof minAgeRestriction !== null) {
        errorResult.push({
            "message": "minAgeRestriction",
            "field": "minAgeRestriction"
        });
    }
    if (typeof canBeDownloaded !== 'boolean' && typeof canBeDownloaded === undefined) {
        errorResult.push({
            "message": "canBeDownloaded",
            "field": "canBeDownloaded"
        });
    }
    if (!Array.isArray(availableResolutions) && !permissionValues.includes(availableResolutions)) {
        errorResult.push({
            "message": "Should be a string",
            "field": "publicationDate"
        });
    }
    if (typeof publicationDate !== 'string') {
        errorResult.push({
            "message": "Should be a string",
            "field": "publicationDate"
        });
    }
    if (errorResult.length > 0) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .send({ errorsMessages: errorResult });
        return;
    }
    video.title = title;
    video.author = author;
    video.minAgeRestriction = minAgeRestriction;
    video.canBeDownloaded = canBeDownloaded;
    video.availableResolutions = availableResolutions;
    video.publicationDate = publicationDate;
    res.sendStatus(HTTP_STATUSES.OK200);
});
app.post('/videos', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    let errorResult = [];
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        errorResult.push({
            "message": "Incorrect title",
            "field": "title"
        });
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        errorResult.push({
            "message": "Incorrect author",
            "field": "author"
        });
    }
    if (!Array.isArray(availableResolutions) && !permissionValues.includes(availableResolutions)) {
        errorResult.push({
            "message": "Should be a string",
            "field": "availableResolutions"
        });
    }
    if (errorResult.length > 0) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .send({ errorsMessages: errorResult });
        return;
    }
    const newVideo = {
        "id": +(new Date()),
        "title": title,
        "author": author,
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": new Date().toISOString(),
        "publicationDate": new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        "availableResolutions": availableResolutions
    };
    videos.push(newVideo);
    res
        .status(HTTP_STATUSES.CREATED_201)
        .send(newVideo);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
