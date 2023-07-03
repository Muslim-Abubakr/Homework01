import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.port || 5000

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
]

const permissionValues = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

const HTTP_STATUSES = {
    OK200: 200,
    CREATED_201: 201,
    NO_CONTENT: 204,
  
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
  }

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})

app.get('/videos/:id', (req: Request, res: Response) => {
    let foundVideo = videos.find(v => v.id === +req.params.id)

    if (foundVideo) {
        res
            .status(HTTP_STATUSES.OK200)
            .send(foundVideo)
    } else {
        res.status(HTTP_STATUSES.NOT_FOUND_404)
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    const video = videos.find(v => v.id === +req.params.id)

    if(!video) {
        return res.status(404)
    }

    videos = videos.filter(v => v.id !== video.id)
    return res.status(204)
    // for (let i = 0; i < videos.length; i++) {
    //     if (videos[i].id === +req.params.id) {
    //         videos.splice(i, 1)
    //         res.sendStatus(HTTP_STATUSES.NO_CONTENT)
    //         return;
    //     } else {
    //         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    //     }
    // }
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

app.put('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id

    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    const canBeDownloaded = req.body.canBeDownloaded
    const minAgeRestriction = req.body.minAgeRestriction
    const publicationDate = req.body.publicationDate

    let errorResult = []

    let video = videos.find(v => v.id === id)

    if (!video) {
        res.status(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    if (!title || typeof title !== 'string' || title.trim() || title.length > 40) {
        errorResult.push({
            "message": "Incorrect title",
            "field": "title"
        })
    }

    if (!author || typeof author !== 'string' || author.trim() || author.length > 20) {
        errorResult.push({
            "message": "Incorrect author",
            "field": "author"
        })
    }

    if (minAgeRestriction.length < 18 || minAgeRestriction < 1 || typeof minAgeRestriction !== null) {
        errorResult.push({
            "message": "minAgeRestriction",
            "field": "minAgeRestriction"  
        })
    }

    if (typeof canBeDownloaded !== 'boolean' && typeof canBeDownloaded === undefined) {
        errorResult.push({
            "message": "canBeDownloaded",
            "field": "canBeDownloaded"  
        })
    }

    if (availableResolutions && typeof availableResolutions !== 'string') {
        errorResult.push({
            "message": "Should be a string",
            "field": "publicationDate"  
        })
    }

    if (typeof publicationDate !== 'string') {
        errorResult.push({
            "message": "Should be a string",
            "field": "publicationDate"  
        })
    }

    if (errorResult.length > 0) {
        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .send({errorsMessages: errorResult})
            return;
      }

      video.title = title
      video.author = author
      video.minAgeRestriction = minAgeRestriction
      video.canBeDownloaded = canBeDownloaded
      video.availableResolutions = availableResolutions
      video.publicationDate = publicationDate
  
      res.status(HTTP_STATUSES.OK200)

})

app.post('/videos', (req: Request, res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const availableResolutions = req.body.availableResolutions
    const canBeDownloaded = req.body.canBeDownloaded
    const minAgeRestriction = req.body.minAgeRestriction
    const publicationDate = req.body.publicationDate

    let errorResult = []

    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        errorResult.push({
            "message": "Incorrect title",
            "field": "title"
        })
      }

    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        errorResult.push({
            "message": "Incorrect author",
            "field": "author"
        })
      }

    // if (minAgeRestriction < 18 || minAgeRestriction < 1 || typeof minAgeRestriction !== 'number') {
    //     errorResult.push({
    //         "message": "minAgeRestriction",
    //         "field": "minAgeRestriction"  
    //     })
    // }

    // if (typeof canBeDownloaded !== 'boolean' && canBeDownloaded === undefined) {
    //     errorResult.push({
    //         "message": "canBeDownloaded",
    //         "field": "canBeDownloaded"  
    //     })
    // }

    if (typeof availableResolutions !== 'string') {
        errorResult.push({
            "message": "Should be a string",
            "field": "availableResolutions"  
        })
    }

    // if (typeof publicationDate !== 'string') {
    //     errorResult.push({
    //         "message": "Should be a string",
    //         "field": "publicationDate"  
    //     })
    // }

    if(errorResult.length > 0) {
    res
        .status(HTTP_STATUSES.BAD_REQUEST_400)
        .send({errorsMessages: errorResult})
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
    }

    videos.push(newVideo)
    res
        .status(HTTP_STATUSES.CREATED_201)
        .send(newVideo)

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

