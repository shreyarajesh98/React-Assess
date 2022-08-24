'use strict'
require('./database/db')
const Users = require('./models/user')
const bcrypt = require('bcrypt');
require('dotenv').config();


const fp = require('fastify-plugin')

const pino = require('pino')
const logger = pino()

const fastify = require('fastify')({
  logger: true
})

fastify.register(require('@fastify/jwt'), {
  secret: 'mysecret',
})

fastify.register(fp(async function (fastify) {

  fastify.decorate('logger', function (type, request, response) {
        if (type == 'info') {
            logger.info(fastify.infoLog(request, response))
        } else if (type == 'fatal') {
            logger.fatal(fastify.fatalLog(request, response))
        } else {
            logger.error(fastify.errorLog(request, response))
        }
    })
  fastify.decorate('infoLog', function (request, response) {
        return {
            user: {
              emailAddress: request && request.body ? request.body.emailAddress : 'NA'
            },
            request: {
              url: request && request.url,
              method: request && request.method
              // body: request && request.body // this is causing a big log"
            },
            headers: {
              origin: request && request.headers.origin,
              'user-agent': request && request.headers['user-agent']
            },
            response: {
              message: response.message
            }
    }
    })
}))

fastify.register(require('@fastify/cors'), (instance) => {
  return (req, callback) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: true
    };

    // do not include CORS headers for requests from localhost
    if (/^localhost$/m.test(req.headers.origin)) {
      corsOptions.origin = false
    }

    // callback expects two parameters: error and options
    callback(null, corsOptions)
  }
})

 fastify.decorate('authenticate', async function (request, reply) {
   try {
   if (!request.headers.authorization) return reply.code(404).send({
      message: "Authorization fail",
      error: 'Not Found',
      status: 404
    })
     await request.jwtVerify()
    } catch (error) {
      return reply.code(403).send(new Error(error))
    }
 })

const start = async () => {
  try {
    await fastify.listen({ port: 5000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

fastify.post('/login', async function (request, reply) {
  try {
    const user = await Users.findOne({
        emailaddress: request.body.emailaddress
      })
    if (!user) {
        const response = {
          message: "invalid user"
        }
        fastify.logger('info', request, response)
        return reply.code(400).send(response)
    }
     const matchPassword = await bcrypt
        .compare(request.body.password, user.password)
        .then((match) => {
          return match
        })
     if (!matchPassword) {
        const response = {
          message: `You have entered incorrect credentials . Please try again.`
        }
        fastify.logger('info', request, response)
        return reply.code(400).send(response)
    }
    let jwtExpire='3h'
    let token = fastify.jwt.sign({ userId: user._id });
    const response = {
      message: 'You have successfully logged in.',
      token: token,
      expiresAt: new Date(new Date().setHours(new Date().getHours() + jwtExpire.replace(/[^0-9]/gi, ''))),
      user: {
        emailaddress: user.emailaddress,
        firstName: user.firstName
      }
    }
      fastify.logger('info', request, response)
      return reply.code(200).send(response)
        
      
  } catch (error) {
    console.log(error)
    }
})

fastify.post('/register', async function (request, reply) {
  try {
     const newUser = {
      emailaddress: request.body.emailaddress,
      firstname: request.body.firstname,
      password: bcrypt.hashSync(request.body.password, 10)
    }
    const findUser = await Users.findOne({
      emailaddress: request.body.emailaddress
    })

    if (findUser) {
      const response = {
        message: "Email address is already taken"
      }
      fastify.logger('info', request, response)
      return reply.code(400).send(response)
  }
    await Users.create(newUser);
     const response = {
      message: 'Registration successfull',
    }
  
    fastify.logger('info', request, response)
    return reply.code(200).send(response)
    } catch (error) {
      console.log(error)
    }
})

fastify.post('/user', { onRequest: [fastify.authenticate] },
  async function (request, reply) {
    try {
      
     const user = await Users.findOne({
        emailaddress: request.body.emailaddress
      })
      if(user) {
      const response = {
        message: "Welcome to code snippets",
        data: {
          firstname: user.firstname,
          emailaddress: user.emailaddress
        },
      }

    fastify.logger('info', request, response)
    return reply.code(200).send(response)
    } else {
      const response = {
        message: "Invalid User",
      }
      fastify.logger('info', request, response)
        return reply.code(400).send(response)
    }
  } catch (err) {
    console.log(err);
  }
})
fastify.post('/update', async function (request, reply) {
  try {
    const user = await Users.findOneAndUpdate({
        emailaddress: request.body.emailaddress
    }, {
      $set: { document: request.body.document }
    }
    )
    console.log(user)
     const response = {
      message: 'successfully updated',
    }
    fastify.logger('info', request, response)
    return reply.code(200).send(response)
    } catch (error) {
      console.log(error)
    }
})

