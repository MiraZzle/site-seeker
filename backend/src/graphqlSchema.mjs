import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";

// WebPageType definice
export const WebPageType = new GraphQLObjectType({
  name: "WebPage",
  fields: {
    identifier: { type: GraphQLID },
    label: { type: GraphQLString },
    url: { type: GraphQLString },
    regexp: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    active: { type: GraphQLBoolean },
    periodicity: { type: GraphQLString },
  },
});

// NodeType definice
export const NodeType = new GraphQLObjectType({
  name: "Node",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    url: { type: GraphQLString },
    crawlTime: { type: GraphQLString },
    links: { type: new GraphQLList(NodeType) },
    owner: { type: WebPageType },
  }),
});

// Definice GraphQL schématu
export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      websites: {
        type: new GraphQLList(WebPageType),
        resolve: async (_, __, { model }) => {
          const records = await model.getAllWebsiteRecords();
          return records.map((record) => ({
            identifier: record.id,
            label: record.label,
            url: record.url,
            regexp: record.boundaryRegExp,
            tags: record.tags,
            active: record.isActive,
            periodicity: record.periodicity,
          }));
        },
      },
      nodes: {
        type: new GraphQLList(NodeType),
        args: {
          webPages: { type: new GraphQLList(GraphQLID) },
        },
        resolve: async (_, { webPages }, { model }) => {
          const nodes = await model.getNodesByWebPageIds(webPages);
          return nodes;
        },
      },
    },
  }),
});
