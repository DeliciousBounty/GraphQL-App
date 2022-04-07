const express= require('express')
const { graphql, GraphQLInt } = require('graphql')
const expressGraphQL = require('express-graphql').graphqlHTTP
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
}=require('graphql')

const app = express()

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]
/*
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld',
        fields: () => ({
            message: { 
                type: GraphQLString ,
                resolve: () =>  'Hello world'
            }
        })
    })
})*/
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: "this represents a  author of a book",
    fields: ()=> ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {type: new GraphQLList(BookType),
            resolve: (author)=> {
                return books.filter(book => book.authorId ===author.id)
            }
        }
        
    })
})
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: "this represents a book by an author",
    fields: ()=> ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: { type: GraphQLNonNull(GraphQLInt)},
        author: {type: AuthorType,
        resolve: (book) => {
            return authors.find(author => author.id === book.author.idd )
        }
        }
    })
})





const RootQueryType = new GraphQLObjectType({
    name:'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'Single Book',
            args:{
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)

        },

        books: {
            type: new GraphQLList(BookType),
            description: 'list of all Books',
            resolve: () => books

        },
        authors: {
            type: new GraphQLList(AuthorType),
            desscription: 'List of all Authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            desscription: 'Single Authors',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent,args) => authors.find(authors => author.id === args.id)
        }

    })

})
const RootMutationType = new GraphQLObjectType({
    name: 'mutation', 
    description: "mutation",
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args:{
                name: { type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent,args) => {
                const book = {id: books.length + 1, name: args.name, authorId:
                args.authorId}
                books.push(book)
                return book
            }
            
        }
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql', expressGraphQL({
    schema: schema, 
    graphiql:true
}))
app.listen(5000, () => console.log("running"))