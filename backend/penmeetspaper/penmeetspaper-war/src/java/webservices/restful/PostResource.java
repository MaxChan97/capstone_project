/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Comment;
import entity.Person;
import entity.PersonAnswer;
import entity.Poll;
import entity.Post;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.CommentSessionBeanLocal;
import session.PersonAnswerSessionBeanLocal;
import session.PollSessionBeanLocal;
import session.PostSessionBeanLocal;
import session.TrendSessionBeanLocal;

/**
 *
 * @author Max
 */
@Path("post")
public class PostResource {

  @EJB
  private PostSessionBeanLocal postSBLocal;
  @EJB
  private CommentSessionBeanLocal commentSBLocal;
  @EJB
  private PollSessionBeanLocal pollSBLocal;
  @EJB
  private PersonAnswerSessionBeanLocal personAnswerSBLocal;

  @EJB
  private TrendSessionBeanLocal trendSBLocal;

  private JsonObject createJsonObject(String jsonString) {
    JsonReader reader = Json.createReader(new StringReader(jsonString));
    return reader.readObject();
  }

  private Response buildError(Exception e, int statusCode) {
    JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

    return Response.status(statusCode).entity(exception).type(MediaType.APPLICATION_JSON).build();
  }

  private Poll createPoll(String postPollQuestion, JsonArray postPollOptions) {
    Poll postPoll = new Poll();
    postPoll.setQuestion(postPollQuestion);
    for (int i = 0; i < postPollOptions.size(); i++) {
      String pollOption = postPollOptions.getString(i);
      PersonAnswer personAnswer = new PersonAnswer();
      PersonAnswer persistedPersonAnswer = personAnswerSBLocal.createPersonAnswer(personAnswer);
      postPoll.getOptions().put(pollOption, persistedPersonAnswer);
    }
    return pollSBLocal.createPoll(postPoll);
  }

  @POST
  @Path("/person/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createPostForPerson(@PathParam("id") Long personId, String jsonString) {
    JsonObject jsonObject = createJsonObject(jsonString);

    String postBody = jsonObject.getString("postBody");
    String fileName = jsonObject.getString("fileName");
    String fileUrl = jsonObject.getString("fileUrl");
    String fileType = jsonObject.getString("fileType");
    String postPollQuestion = jsonObject.getString("postPollQuestion");
    JsonArray postPollOptions = jsonObject.getJsonArray("postPollOptions");

    Post p = new Post();
    p.setBody(postBody);
    p.setFileName(fileName);
    p.setFileUrl(fileUrl);
    p.setFileType(fileType);
    p.setDatePosted(new Date());

    if (!postPollQuestion.equals("")) {
      // means got poll need create poll
      p.setPoll(createPoll(postPollQuestion, postPollOptions));
    }

    try {
      postSBLocal.createPostForPerson(personId, p);
      return Response.status(204).build();
    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end createPostForPerson

  @POST
  @Path("/community/{communityId}/person/{personId}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createPostForCommunity(@PathParam("communityId") Long communityId,
          @PathParam("personId") Long personId, String jsonString) {
    JsonObject jsonObject = createJsonObject(jsonString);

    String postBody = jsonObject.getString("postBody");
    String fileName = jsonObject.getString("fileName");
    String fileUrl = jsonObject.getString("fileUrl");
    String fileType = jsonObject.getString("fileType");
    String postPollQuestion = jsonObject.getString("postPollQuestion");
    JsonArray postPollOptions = jsonObject.getJsonArray("postPollOptions");

    Post p = new Post();
    p.setBody(postBody);
    p.setFileName(fileName);
    p.setFileUrl(fileUrl);
    p.setFileType(fileType);
    p.setDatePosted(new Date());

    if (!postPollQuestion.equals("")) {
      // means got poll need create poll
      p.setPoll(createPoll(postPollQuestion, postPollOptions));
    }

    try {
      postSBLocal.createPostForCommunity(p, personId, communityId);
      return Response.status(204).build();
    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end createPostForPerson

  @PUT
  @Path("/person/{personId}/edit/{postId}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response editPersonsPost(@PathParam("personId") Long personId, @PathParam("postId") Long postId,
          String jsonString) {

    JsonObject jsonObject = createJsonObject(jsonString);

    String postBody = jsonObject.getString("postBody");

    Post p = new Post();
    p.setBody(postBody);
    p.setId(postId);

    try {

      postSBLocal.checkPostCredentials(postId, personId);
      postSBLocal.updatePost(p);
      return Response.status(204).build();

    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }

  } // end editPersonsPost

  @DELETE
  @Path("/person/{personId}/{postId}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deletePersonsPost(@PathParam("personId") Long personId, @PathParam("postId") Long postId) {
    try {

      postSBLocal.checkPostCredentials(postId, personId);

      postSBLocal.deletePostForPerson(postId);
      return Response.status(204).build();

    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end deletePersonsPost

  @DELETE
  @Path("/community/{personId}/{postId}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteCommunityPost(@PathParam("personId") Long personId, @PathParam("postId") Long postId) {
    try {

      postSBLocal.checkPostCredentials(postId, personId);
      postSBLocal.deletePostForCommunity(postId);
      return Response.status(204).build();

    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  }

  @POST
  @Path("/{postId}/person/{personId}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createCommentForPost(@PathParam("postId") Long postId, @PathParam("personId") Long personId,
          String jsonString) {

    JsonObject jsonObject = createJsonObject(jsonString);

    String commentBody = jsonObject.getString("commentBody");
    Comment comment = new Comment();
    comment.setBody(commentBody);
    comment.setDatePosted(new Date());
    try {

      commentSBLocal.createCommentForPost(personId, postId, comment);
      return Response.status(204).build();

    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end createCommentForPost

  @PUT
  @Path("/{postId}/person/{personId}/like")
  @Produces(MediaType.APPLICATION_JSON)
  public Response likePost(@PathParam("postId") Long postId, @PathParam("personId") Long personId) {
    try {

      postSBLocal.likePost(postId, personId);
      return Response.status(204).build();

    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end likePost

  @PUT
  @Path("/{postId}/person/{personId}/unlike")
  @Produces(MediaType.APPLICATION_JSON)
  public Response unlikePost(@PathParam("postId") Long postId, @PathParam("personId") Long personId) {
    try {

      postSBLocal.unlikePost(postId, personId);
      return Response.status(204).build();

    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end unlikePost

  @GET
  @Path("/{postId}/{isCommunityPost}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response getPost(@PathParam("postId") Long postId, @PathParam("isCommunityPost") boolean isCommunityPost) {
    try {

      if (isCommunityPost) {
        Post post = postSBLocal.getPostById(postId, true);
        return Response.status(200).entity(post).type(MediaType.APPLICATION_JSON).build();
      }

      Post post = postSBLocal.getPostById(postId);

      return Response.status(200).entity(post).type(MediaType.APPLICATION_JSON).build();

    } catch (NoResultException | NotValidException e) {
      return buildError(e, 400);
    }
  } // end getPost

    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchPostByBody(@QueryParam("searchTerm") String searchTerm) {
        try {
            if (searchTerm != null) {
                List<Post> results = postSBLocal.searchPostByBody(searchTerm);
                GenericEntity<List<Post>> entity = new GenericEntity<List<Post>>(results) {
                };

                return Response.status(200).entity(entity).build();
            } else {
                JsonObject exception = Json.createObjectBuilder().add("error", "No query conditions").build();

                return Response.status(400).entity(exception).build();
            }
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

}
