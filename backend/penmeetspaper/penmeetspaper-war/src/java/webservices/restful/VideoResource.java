/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package webservices.restful;

import entity.Video;
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
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.GenericEntity;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import session.VideoSessionBeanLocal;

/**
 * REST Web Service
 *
 * @author carlc
 */
@Path("video")
public class VideoResource {

    @EJB
    private VideoSessionBeanLocal videoSessionBean;

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
    @Path("/upload")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createVideoForPerson(String jsonString) {
        JsonObject jsonObject = createJsonObject(jsonString);

        int personId = jsonObject.getInt("id");
        String title = jsonObject.getString("title");
        String description = jsonObject.getString("description");
        String fileName = jsonObject.getString("fileName");
        String fileUrl = jsonObject.getString("fileUrl");
        String fileType = jsonObject.getString("fileType");
        Boolean isPaid = jsonObject.getBoolean("isSubscriberOnly");

        JsonArray relatedTopicsJsonArray = jsonObject.getJsonArray("videoTopics");
        List<TopicEnum> relatedTopics = convertToTopicEnumList(relatedTopicsJsonArray);

        Video v = new Video();
        v.setTitle(title);
        v.setDescription(description);
        v.setFileName(fileName);
        v.setFileUrl(fileUrl);
        v.setFileType(fileType);
        v.setIsPaid(isPaid);
        v.setNoOfViews(new Long(0));
        v.setDatePosted(new Date());
        v.setRelatedTopics(relatedTopics);

        try {
            videoSessionBean.createVideoForPerson(new Long(personId), v);
            return Response.status(204).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end createVideoForPerson

    @GET
    @Path("/person/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPersonsVideos(@PathParam("id") Long personId) {
        try {

            List<Video> results = videoSessionBean.getPersonsVideos(personId);
            GenericEntity<List<Video>> entity = new GenericEntity<List<Video>>(results) {
            };

            return Response.status(200).entity(entity).build();

        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end getPersonsVideos

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getVideo(@PathParam("id") Long videoId) {
        try {
            Video video = videoSessionBean.getVideo(videoId);
            return Response.status(200).entity(video).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end getVideo

    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllVideos() {
        try {
            List<Video> results = videoSessionBean.getAllVideos();
            GenericEntity<List<Video>> entity = new GenericEntity<List<Video>>(results) {
            };
            return Response.status(200).entity(entity).build();
        } catch (NoResultException | NotValidException e) {
            return buildError(e, 400);
        }
    } // end getAllVideos

    @GET
    @Path("/trend/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getVideosByTrend(@QueryParam("hashtag") String hashtag) {
        try {
            hashtag = "#" + hashtag;
            List<Video> results = videoSessionBean.getVideosByTrend(hashtag);
            GenericEntity<List<Video>> entity = new GenericEntity<List<Video>>(results) {
            };
            
            return Response.status(200).entity(entity).build();
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
    
    @GET
    @Path("/query")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchVideoByTitleAndDescription(@QueryParam("searchString") String searchString) {
        try {
            if (searchString != null) {
                List<Video> results = videoSessionBean.searchVideoByTitleAndDescription(searchString);
                GenericEntity<List<Video>> entity = new GenericEntity<List<Video>>(results) {
                };
                
                return Response.status(200).entity(entity).build();
            } else {
                JsonObject exception = Json.createObjectBuilder().add("error", "No query conditions").build();

                return Response.status(400).entity(exception).build();
            }
        } catch (Exception e) {
            JsonObject exception = Json.createObjectBuilder().add("error", e.getMessage()).build();
            return Response.status(404).entity(exception).type(MediaType.APPLICATION_JSON).build();
        }
    }
}
