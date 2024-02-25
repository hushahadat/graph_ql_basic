const express = require('express')
const {graphqlHTTP } = require('express-graphql')

const {GraphQLSchema,GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt, GraphQLScalarType} = require('graphql')

const app = express()

const authors = [
    {
        id : 1 ,
        name : "hussain"
    },
    {
        id : 2,
        name : "JRD TATA"
    },
    {
        id : 3,
        name : "Azim PermJi"
    }
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


 const BookType = new GraphQLObjectType({
    name : "Book",
    description : "All books",
    fields : ()=> ({
        id : { type : GraphQLNonNull( GraphQLInt)},
        name : {type : GraphQLNonNull( GraphQLString)},
        authorId : {type : GraphQLNonNull( GraphQLInt)},
        author :  {
            type : AuthorType,
             resolve : (book) => {
                return authors.find(author => author.id === book.authorId)
             }
         }
    })
 })

 const AuthorType = new GraphQLObjectType({
    name : "Author",
    description : "All Authors Name",
    fields : ()=> ({
        id : { type : GraphQLNonNull( GraphQLInt)},
        name : {type : GraphQLNonNull( GraphQLString)},
        books : {
            type: GraphQLList(BookType),
            resolve :(author)=>{
                return  books.filter(book => book.authorId == author.id)
            }
        }
    })
 })

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description : "root query",
  fields: () => ({
    book: { 
        type: BookType, 
        description : "Single Books", 
        args : {
            id : {type : GraphQLInt}
        },
        resolve: (parent,arg) => books.find(book => book.id == arg.id)
     },
    books: { 
        type: new GraphQLList(BookType), 
        description : "List of all Books", 
        resolve: () => books
     },
     author :{
        type : AuthorType,
        description : "A Single Author",
        args :{
            id : {type : GraphQLInt}
        },
        resolve : (parent,arg) => authors.find(auth => auth.id == arg.id) 
     },
     authors: { 
        type: new GraphQLList(AuthorType), 
        description : "List of all author", 
        resolve: () => authors
     },
  }),
});

const RootMutationType = new GraphQLObjectType({
    name : "Mutation",
    description : "",
    fields : ()=>({
        addBook : {
            type : BookType,
            description : "",
            args : {
                name : {type : GraphQLNonNull(GraphQLString)},
                authorId :  {type : GraphQLNonNull(GraphQLInt)},
            },
            resolve : (paraents,args) => {
                let Books = {id : books.length +1, name : args.name, authorId : args.authorId}
                books.push(Books)
                return Books
            }
        }
    })
})

const schema = new GraphQLSchema({
    query : RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP ({
    schema : schema,
    graphiql:true
}))
app.listen(3000, ()=> console.log("app is running on pory 3000"))