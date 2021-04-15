/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.LiveChat;
import entity.LivePoll;
import entity.PersonAnswer;
import entity.Stream;
import java.io.StringReader;
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
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.LivePollSessionBeanLocal;
import session.PersonAnswerSessionBeanLocal;
import session.StreamSessionBeanLocal;

/**
 *
 * @author Max
 */
@Path("stream")
public class StreamResource {

    @EJB
    private StreamSessionBeanLocal streamSBLocal;
    @EJB
    private PersonAnswerSessionBeanLocal personAnswerSBLocal;
    @EJB
    private LivePollSessionBeanLocal livePollSBLocal;

    @POST
    @Path("/{streamerId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response startStream(@PathParam("streamerId") Long streamerId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String streamTitle = jsonObject.getString("streamTitle");
        String streamDescription = jsonObject.getString("streamDescription");
        Boolean isPaid = jsonObject.getBoolean("subscribersOnly");
        String accessUrl = jsonObject.getString("accessUrl");
        String thumbnailUrl = jsonObject.getString("thumbnailUrl");

        try {
            Stream newStream = streamSBLocal.createStream(streamerId, streamTitle, streamDescription, isPaid, accessUrl, thumbnailUrl);
            return Response.status(200).entity(newStream).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    private LivePoll createLivePoll(String livePollQuestion, JsonArray livePollOptions) {
        LivePoll livePoll = new LivePoll();
        livePoll.setQuestion(livePollQuestion);
        livePoll.setIsActive(true);
        for (int i = 0; i < livePollOptions.size(); i++) {
            String pollOption = livePollOptions.getString(i);
            PersonAnswer personAnswer = new PersonAnswer();
            PersonAnswer persistedPersonAnswer = personAnswerSBLocal.createPersonAnswer(personAnswer);
            livePoll.getOptions().put(pollOption, persistedPersonAnswer);
        }
        return livePollSBLocal.createLivePoll(livePoll);
    }

    @POST
    @Path("/livePoll/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response startLivePoll(@PathParam("streamId") Long streamId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String livePollQuestion = jsonObject.getString("livePollQuestion");
        JsonArray livePollOptions = jsonObject.getJsonArray("livePollOptions");

        try {
            // create the live poll
            LivePoll livePoll = createLivePoll(livePollQuestion, livePollOptions);
            // add it to stream
            streamSBLocal.addLivePollToStream(streamId, livePoll);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/livePoll/{livePollId}/person/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response voteOnLivePoll(@PathParam("livePollId") Long livePollId, @PathParam("personId") Long personId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String optionVoted = jsonObject.getString("optionVoted");

        try {
            livePollSBLocal.voteOnLivePoll(personId, livePollId, optionVoted);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @DELETE
    @Path("/livePoll/{livePollId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response endLivePoll(@PathParam("livePollId") Long livePollId) {
        try {
            streamSBLocal.endLivePoll(livePollId);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/livePoll/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getActiveLivePollByStreamId(@PathParam("streamId") Long streamId) {
        try {
            LivePoll activeLivePoll = streamSBLocal.getActiveLivePollByStreamId(streamId);
            if (activeLivePoll == null) {
                Response.status(200).build();
            }
            return Response.status(200).entity(activeLivePoll).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response endStream(@PathParam("streamId") Long streamId) {
        try {
            streamSBLocal.endStream(streamId);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStreamById(@PathParam("streamId") Long streamId) {
        try {
            Stream stream = streamSBLocal.getStreamById(streamId);
            return Response.status(200).entity(stream).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/liveChat/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLiveChatByStreamId(@PathParam("streamId") Long streamId) {
        try {
            LiveChat liveChat = streamSBLocal.getLiveChatByStreamId(streamId);
            return Response.status(200).entity(liveChat).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @POST
    @Path("/liveChat/{streamId}/{senderId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response sendLiveChatMessage(@PathParam("streamId") Long streamId, @PathParam("senderId") Long senderId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String messageBody = jsonObject.getString("messageBody");
        try {
            streamSBLocal.sendLiveChatMessage(streamId, senderId, messageBody);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/streamInfo/{streamId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editStreamInfo(@PathParam("streamId") Long streamId, String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = reader.readObject();
        String newStreamTitle = jsonObject.getString("streamTitle");
        String newStreamDescription = jsonObject.getString("streamDescription");

        try {
            streamSBLocal.editStreamInfo(streamId, newStreamTitle, newStreamDescription);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/ongoing")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOngoingStreams() {
        try {
            List<Stream> streams = streamSBLocal.getOngoingStreams();
            GenericEntity<List<Stream>> entity = new GenericEntity<List<Stream>>(streams) {
            };

            return Response.status(200).entity(entity).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @GET
    @Path("/ongoing/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonOngoingStreams(@PathParam("personId") Long personId) {
        try {
            List<Stream> streams = streamSBLocal.getPersonOngoingStreams(personId);
            GenericEntity<List<Stream>> entity = new GenericEntity<List<Stream>>(streams) {
            };

            return Response.status(200).entity(entity).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/views/enter/{streamId}/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response handleEnterStream(@PathParam("streamId") Long streamId, @PathParam("personId") Long personId) {
        try {
            streamSBLocal.handleEnterStream(streamId, personId);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/views/exit/{streamId}/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response handleExitStream(@PathParam("streamId") Long streamId, @PathParam("personId") Long personId) {
        try {
            streamSBLocal.handleExitStream(streamId, personId);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/kickUser/{streamId}/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response kickUserFromStream(@PathParam("streamId") Long streamId, @PathParam("personId") Long personId) {
        try {
            streamSBLocal.kickUserFromStream(streamId, personId);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }

    @PUT
    @Path("/unkickUser/{streamId}/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response unkickUserFromStream(@PathParam("streamId") Long streamId, @PathParam("personId") Long personId) {
        try {
            streamSBLocal.unkickUserFromStream(streamId, personId);
            return Response.status(204).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
}
