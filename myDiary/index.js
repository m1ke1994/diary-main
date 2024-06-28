let express = require(`express`);
let app = express();
let cors = require('cors')
let port = 3000;
app.listen(port, function () {
    console.log(`Сервер запущен: http://localhost:${port}`)
});

app.use(cors())
app.use(express.json())
app.use(express.static('public'));



// Настройка БД
let mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/diary');


// Схема и модель
let schema=new mongoose.Schema({
    subject:String,
    mark:Number,

},{
    timestamps:true,
});


let Grade=mongoose.model('grade',schema);


// Роуты'

// Поиск с фильтрацией
app.get(`/grades`, async function (req, res) {
    let subject=req.query.subject;
    let mark=req.query.mark;
    let search={};
    if(subject){
        search.subject=subject;
    }
    if(mark){
        search.mark=mark;
    }
    let data= await Grade.find(search);
    res.send(data);
});



// Записываем новую оценку
app.post(`/grades`, async function (req, res) {
    let subject=req.body.subject;
    let mark=req.body.mark;
// Создание оценки
    let grade=new Grade({
        subject:subject,
        mark:mark
    });
    await grade.save();
    res.sendStatus(201);
});


// Удаление оценки
app.delete(`/grades`, async function (req, res) {
    let id=req.query.id;
    await Grade.deleteOne({_id:id});
    res.sendStatus(200);

});


// Изменение оценки
app.put(`/grades`, async function (req, res) {
    let id = req.body.id;
    let mark = req.body.mark;
    let grade = await Grade.findOne({_id:id});

    grade.mark=mark;

    await grade.save();

    res.sendStatus(200);
})
/* app.put(`/grades`, async function (req, res) {
    let id = req.body.id;
    let mark = req.body.mark;
    
    try {
        let grade = await Grade.findOne({_id: id});
        
        if (!grade) {
            return res.status(404).send("Grade not found");
        }

        grade.mark = mark;
        await grade.save();
        
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}); */

