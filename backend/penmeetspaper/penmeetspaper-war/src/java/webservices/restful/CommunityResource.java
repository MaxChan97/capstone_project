/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Community;
import enumeration.TopicEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.CommunitySessionBeanLocal;

/**
 *
 * @author shawn
 */
@Path("community")
public class CommunityResource {

    @EJB
    private CommunitySessionBeanLocal communitySB;

    private JsonObject createJsonObject(String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        return reader.readObject();
    }

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder()
                .add("error", e.getMessage())
                .build();

        return Response.status(statusCode).entity(exception)
                .type(MediaType.APPLICATION_JSON).build();
    }

    private List<TopicEnum> convertToTopicEnumList(JsonArray topicInterestsJsonArray) {
        List<TopicEnum> topicInterests = new ArrayList<TopicEnum>();

        for (int i = 0; i < topicInterestsJsonArray.size(); i++) {
            String topicInterest = topicInterestsJsonArray.getString(i);
            if ("REAL_ESTATE".equals(topicInterest)) {
                topicInterests.add(TopicEnum.REAL_ESTATE);
            } else if ("STOCKS".equals(topicInterest)) {
                topicInterests.add(TopicEnum.STOCKS);
            } else if ("FUTURES".equals(topicInterest)) {
                topicInterests.add(TopicEnum.FUTURES);
            } else if ("CRYPTOCURRENCY".equals(topicInterest)) {
                topicInterests.add(TopicEnum.CRYPTOCURRENCY);
            }
        }

        return topicInterests;
    }

    // RESTful APIs ----------------------------------------------------------------
    @POST
    @Path("/person/{personId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createCommunity(@PathParam("personId") Long personId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String communityDescription = jsonObject.getString("communityDescription");
        String communityName = jsonObject.getString("communityName");

        Community community = new Community();
        community.setName(communityName);
        community.setDescription(communityDescription);
        community.setDateCreated(new Date());

        try {
            Community createdCommunity = communitySB.createCommunity(community, personId);
            return Response.status(200).entity(
                    createdCommunity
            ).type(MediaType.APPLICATION_JSON).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @GET
    @Path("/{communityId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommunity(@PathParam("communityId") Long communityId) {
        try {
            Community community = communitySB.getCommunityById(communityId);
            return Response.status(200).entity(
                    community
            ).type(MediaType.APPLICATION_JSON).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @PUT
    @Path("/{communityId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editCommunity(@PathParam("communityId") Long communityId, String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String description = jsonObject.getString("description");
        JsonArray topicInterestsJsonArray = jsonObject.getJsonArray("topicEnums");
        String communityProfilePicture = jsonObject.getString("communityProfilePicture");

        List<TopicEnum> topicInterests = convertToTopicEnumList(topicInterestsJsonArray);

        try {
            Community comm = communitySB.getCommunityById(communityId);

            comm.setCommunityProfilePicture(communityProfilePicture);
            comm.setDescription(description);
            comm.setTopicEnums(topicInterests);

            communitySB.updateCommunity(comm);

            return Response.status(204).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

}
