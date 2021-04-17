/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Advertisement;
import enumeration.TopicEnum;
import exception.NoResultException;
import exception.NotValidException;
import java.io.StringReader;
import java.util.ArrayList;
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
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.AdvertisementSessionBeanLocal;

/**
 *
 * @author User
 */
@Path("advertisement")
public class AdvertisementResource {

    @EJB
    AdvertisementSessionBeanLocal aSB;

    private JsonObject createJsonObject(String jsonString) {
        JsonReader reader = Json.createReader(new StringReader(jsonString));
        return reader.readObject();
    }

    private Response buildError(Exception e, int statusCode) {
        JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();

        return Response.status(statusCode).entity(exception).type(MediaType.APPLICATION_JSON).build();
    }

    private List<TopicEnum> convertToTopicEnumList(JsonArray topicInterestsJsonArray) {
        List<TopicEnum> topicInterests = new ArrayList<TopicEnum>();

        for (int i = 0; i < topicInterestsJsonArray.size(); i++) {
            String topicInterest = topicInterestsJsonArray.getString(i);
            if (null != topicInterest) {
                switch (topicInterest) {
                    case "INVESTMENTS":
                        topicInterests.add(TopicEnum.INVESTMENTS);
                        break;

                    case "STOCKS":
                        topicInterests.add(TopicEnum.STOCKS);
                        break;

                    case "SAVINGS":
                        topicInterests.add(TopicEnum.SAVINGS);
                        break;

                    case "CAREER":
                        topicInterests.add(TopicEnum.CAREER);
                        break;

                    case "ETF":
                        topicInterests.add(TopicEnum.ETF);
                        break;

                    case "ROBOADVISORS":
                        topicInterests.add(TopicEnum.ROBOADVISORS);
                        break;

                    case "TRADING":
                        topicInterests.add(TopicEnum.TRADING);
                        break;

                    case "INSURANCE":
                        topicInterests.add(TopicEnum.INSURANCE);
                        break;

                    case "BROKERAGES":
                        topicInterests.add(TopicEnum.BROKERAGES);
                        break;

                    case "RETIREMENT":
                        topicInterests.add(TopicEnum.RETIREMENT);
                        break;

                    case "SALARY":
                        topicInterests.add(TopicEnum.SALARY);
                        break;

                    case "CPF":
                        topicInterests.add(TopicEnum.CPF);
                        break;

                    case "BTO":
                        topicInterests.add(TopicEnum.BTO);
                        break;

                    case "UTILITIES_BILL":
                        topicInterests.add(TopicEnum.UTILITIES_BILL);
                        break;

                    case "REAL_ESTATE":
                        topicInterests.add(TopicEnum.REAL_ESTATE);
                        break;

                    case "FUTURES":
                        topicInterests.add(TopicEnum.FUTURES);
                        break;

                    case "CRYPTOCURRENCY":
                        topicInterests.add(TopicEnum.CRYPTOCURRENCY);
                        break;

                    case "CREDITCARDS":
                        topicInterests.add(TopicEnum.CREDITCARDS);
                        break;

                    case "BANKING":
                        topicInterests.add(TopicEnum.BANKING);
                        break;

                    case "REITS":
                        topicInterests.add(TopicEnum.REITS);
                        break;

                    case "BLOCKCHAIN":
                        topicInterests.add(TopicEnum.BLOCKCHAIN);
                        break;

                    default:
                        break;
                }
            }
        }

        return topicInterests;
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createAdvertisement(String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        String title = jsonObject.getString("title");
        String description = jsonObject.getString("description");
        String linkTo = jsonObject.getString("linkTo");
        String image = jsonObject.getString("image");
        JsonArray topicInterestsJsonArray = jsonObject.getJsonArray("topicInterests");

        List<TopicEnum> topicInterests = convertToTopicEnumList(topicInterestsJsonArray);

        Advertisement a = new Advertisement();
        a.setTitle(title);
        a.setDescription(description);
        a.setLinkTo(linkTo);
        a.setImage(image);
        a.setTopics(topicInterests);
        aSB.createAdvertisement(a);
        return Response.status(204).build();

    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllAdvertisement() {
        List<Advertisement> a = aSB.getAllAdvertisement();

        GenericEntity<List<Advertisement>> entity = new GenericEntity<List<Advertisement>>(a) {
        };

        return Response.status(200).entity(entity).build();

    } // end getTenTopStreamers

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAdById(@PathParam("id") Long id) {
        try {
            Advertisement a = aSB.getAdById(id);

            return Response.status(200).entity(a).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAd(@PathParam("id") Long id) {
        try {
            aSB.deleteAd(id);
            return Response.status(204).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    }
}
