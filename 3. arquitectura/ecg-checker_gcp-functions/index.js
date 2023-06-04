const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const crypto = require('crypto');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { Storage } = require('@google-cloud/storage');
const csvParser = require('csv-parser');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const storage = new Storage();
const bucketName = 'meddatabrigade';
const tracesFolder = 'trazos_demo';

exports.login = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({message: 'Email y contraseña son obligatorios'});
            }

            // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
            const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';

            try {
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const usersCollection = db.collection('usuarios');

                const user = await usersCollection.findOne({ email });

                if (!user) {
                    res.status(401).json({message: 'Email o contraseña incorrectos'});
                } else {
                    const hash = crypto.createHash('sha256');
                    hash.update(password);
                    const hashedPassword = hash.digest('hex');

                    if (hashedPassword === user.password) {
                        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_key', { expiresIn: '30d' });

                        res.status(200).json({
                            message: 'Inicio de sesión exitoso',
                            user: {
                                _id: user._id,
                                nombre: user.nombre,
                                apellido: user.apellido,
                                email: user.email
                            },
                            token
                        });
                    } else {
                        res.status(401).json({ message: 'Email o contraseña incorrectos' });
                    }
                }

                await client.close();
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        });

};

exports.registro = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const { nombre, apellido, email, password } = req.body;

            if (!nombre || !apellido || !email || !password) {
                return res.status(400).json({ message: 'Nombre, apellido, email y contraseña son obligatorios' });
            }

            // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
            const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';

            try {
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const usersCollection = db.collection('usuarios');

                // Comprueba si el correo electrónico ya está registrado
                const existingUser = await usersCollection.findOne({ email });

                if (existingUser) {
                    res.status(409).json({ message: 'El correo electrónico ya está registrado' });
                } else {
                    const hash = crypto.createHash('sha256');
                    hash.update(password);
                    const hashedPassword = hash.digest('hex');

                    const newUser = {
                        nombre,
                        apellido,
                        email,
                        password: hashedPassword,
                        fecha_registro: new Date(),
                        ensayos: [],
                        segmentos: []
                    };

                    await usersCollection.insertOne(newUser);
                    res.status(201).json({ message: 'Usuario registrado exitosamente' });
                }

                await client.close();
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        });

};

exports.getECGSegments = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const userId = req.query.userId;

            if (!userId) {
                return res.status(400).json({ message: 'Se requiere el ID del usuario' });
            }

            // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
            const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';

            try {
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const usersCollection = db.collection('usuarios');

                const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

                if (!user) {
                    res.status(404).json({ message: 'Usuario no encontrado' });
                } else {
                    res.status(200).json({ ecg_segments: user.segmentos });
                }

                await client.close();
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        });

};



exports.insertECGTrace = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const { userId } = req.body;
            const currentDate = new Date();
            const formattedDateTime = currentDate.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });

            if (!userId) {
                return res.status(400).json({ message: 'El ID de usuario es obligatorio' });
            }

            try {
                // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
                const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const tracesCollection = db.collection('trazos_ecg');

                // Obtén la lista de archivos CSV en el bucket de Google Cloud Storage
                const [files] = await storage.bucket(bucketName).getFiles({ prefix: tracesFolder });

                // Procesa cada archivo CSV
                for (const file of files) {
                    // Lee el archivo CSV (esta en formato columna) y conviértelo en un array lista de valores
                    const traceData = await readCSVFile(file);

                    const newTrace = {
                        usuario_id: new ObjectId(userId),
                        imagen_url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
                        fecha_creacion: formattedDateTime,
                        fuente: 'Precargado',
                        trazo: traceData,
                    };

                    // Inserta el nuevo trazo en la colección trazos_ecg
                    await tracesCollection.insertOne(newTrace);
                }

                await client.close();
                res.status(201).json({ message: 'Trazos de ECG insertados exitosamente' });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor', stacktrace: err });
            }
        });

};

/*async function readCSVFile(file) {
    return new Promise((resolve, reject) => {
        const data = [];

        const stream = file.createReadStream().pipe(csvParser());

        stream.on('data', (row) => data.push(row));
        stream.on('end', () => resolve(data));
        stream.on('error', (err) => reject(err));
    });
}*/

async function readCSVFile(file) {
    return new Promise((resolve, reject) => {
        const data = [];

        const stream = file.createReadStream().pipe(csvParser({ headers: false }));

        stream.on('data', (row) => {
            const value = Object.values(row)[0];
            data.push(parseFloat(value));
        });
        stream.on('end', () => resolve(data));
        stream.on('error', (err) => reject(err));
    });
}


exports.getECGTraces = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ message: 'El ID de usuario es obligatorio' });
            }

            try {
                // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
                const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const tracesCollection = db.collection('trazos_ecg');

                // Busca los trazos de ECG que coincidan con el userId
                const ecgTraces = await tracesCollection.find({ usuario_id: new ObjectId(userId) }).toArray();

                await client.close();
                res.status(200).json(ecgTraces);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor', stacktrace: err });
            }
        });

};


const axios = require('axios');

exports.analyzeECGTrace = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const { traceId } = req.body;
            const currentDate = new Date();
            const formattedDateTime = currentDate.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });

            if (!traceId) {
                return res.status(400).json({ message: 'El ID del trazo de ECG es obligatorio' });
            }

            try {
                // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
                const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const tracesCollection = db.collection('trazos_ecg');
                const assayCollection = db.collection('ensayos');

                // Busca el trazo de ECG que coincida con el traceId
                const ecgTrace = await tracesCollection.findOne({ _id: new ObjectId(traceId) });

                if (!ecgTrace) {
                    await client.close();
                    return res.status(404).json({ message: 'Trazo de ECG no encontrado' });
                }

                // Llama al servicio de Cloud Run
                const response = await axios.post('https://heartbeat-analysis-server-high-ustfwxzu4q-uc.a.run.app/api/model/classify_heartbeat', {
                    sequence: ecgTrace.trazo
                });

                // Guarda el resultado en la colección 'ensayos'
                const assay = {
                    usuario_id: ecgTrace.usuario_id,
                    imagen_url: ecgTrace.imagen_url,
                    folder_segments_url: `meddatabrigade/results/${traceId}`,
                    fecha_creacion: formattedDateTime,
                    resultados: response.data,
                    fuente: 'Precargado',
                    guardado: false,
                    trazo: ecgTrace.trazo
                };

                const result = await assayCollection.insertOne(assay);

                await client.close();
                res.status(200).json(result);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor', error_trace: err.message });
            }
        });

};

exports.analyzeNewECGTrace = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const { userId, ecgTrace } = req.body;
            const currentDate = new Date();
            const formattedDateTime = currentDate.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });

            if (!userId) {
                return res.status(400).json({ message: 'El ID del usuario es obligatorio' });
            }

            if (!ecgTrace || !Array.isArray(ecgTrace)) {
                return res.status(400).json({ message: 'El trazo de ECG es obligatorio y debe ser un array' });
            }

            try {
                // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
                const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const assayCollection = db.collection('ensayos');

                // Llama al servicio de Cloud Run
                const response = await axios.post('https://heartbeat-analysis-server-high-ustfwxzu4q-uc.a.run.app/api/model/classify_heartbeat', {
                    sequence: ecgTrace
                });

                // Guarda el resultado en la colección 'ensayos'
                const assay = {
                    usuario_id: new ObjectId(userId),
                    // imagen_url: ecgTrace.imagen_url, // Si no tienes la URL de la imagen, puedes comentar esta línea
                    folder_segments_url: `meddatabrigade/results/${userId}`, // Usa el ID del usuario en lugar del traceId
                    fecha_creacion: formattedDateTime,
                    resultados: response.data,
                    fuente: 'CSV',
                    guardado: false,
                    trazo: ecgTrace
                };

                const result = await assayCollection.insertOne(assay);
                console.log('Resultados de inserción: ',result);
                // Extrae el ID del objeto como un string
                const assayId = result.insertedId.toString();
                await saveJsonToStorage(userId, assayId, assay);


                await client.close();
                res.status(200).json(result);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor', error_trace: err.message });
            }
        });
};

exports.analyzeNewECGImage = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const { userId, ecgTrace } = req.body;
            const currentDate = new Date();
            const formattedDateTime = currentDate.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });

            if (!userId) {
                return res.status(400).json({ message: 'El ID del usuario es obligatorio' });
            }

            if (!ecgTrace || typeof ecgTrace !== 'string') {
                return res.status(400).json({ message: 'El trazo de ECG es obligatorio y debe ser un string base64' });
            }

            try {
                // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
                const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const assayCollection = db.collection('ensayos');

                // Llama al servicio de Cloud Run
                const response = await axios.post('https://heartbeat-analysis-server-high-ustfwxzu4q-uc.a.run.app/api/model/classify_heartbeat_image', {
                    sequence: ecgTrace
                });

                // Guarda el resultado en la colección 'ensayos'
                const assay = {
                    usuario_id: new ObjectId(userId),
                    // imagen_url: ecgTrace.imagen_url, // Si no tienes la URL de la imagen, puedes comentar esta línea
                    folder_segments_url: `meddatabrigade/results/${userId}`, // Usa el ID del usuario en lugar del traceId
                    fecha_creacion: formattedDateTime,
                    resultados: response.data,
                    fuente: 'imagen',
                    guardado: false,
                    imagen_base64: ecgTrace
                };

                const result = await assayCollection.insertOne(assay);
                console.log('Resultados de inserción: ',result);
                // Extrae el ID del objeto como un string
                const assayId = result.insertedId.toString();
                await saveJsonToStorage(userId, assayId, assay);


                await client.close();
                res.status(200).json(result);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor', error_trace: err.message });
            }
        });
};

async function saveJsonToStorage(userId, assayId, assay) {
    const fileName = `${assayId}.json`;
    const folderPath = `results/${userId}`;
    const filePath = `${folderPath}/${fileName}`;

    const file = storage.bucket(bucketName).file(filePath);
    await file.save(JSON.stringify(assay));

    console.log(`JSON file saved to gs://${bucketName}/${filePath}`);
}

exports.getResults = async (req, res) => {
    cors(corsOptions) // Para permitir el acceso a la API desde cualquier origen
        (req, res, async () => {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ message: 'El ID del usuario es obligatorio' });
            }

            try {
                // Reemplaza con tus credenciales y la dirección de conexión a MongoDB Atlas
                const uri = 'mongodb+srv://USER-DATABASE:PASSWORD-DATABASE@cluster0.ID-DATABASE.mongodb.net/?retryWrites=true&w=majority';
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

                const db = client.db('proyecto-final');
                const assayCollection = db.collection('ensayos');

                // Busca los resultados de ensayos que coincidan con el userId
                const results = await assayCollection.find({ usuario_id: new ObjectId(userId) }).toArray();

                await client.close();
                res.status(200).json(results);
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        });
};


