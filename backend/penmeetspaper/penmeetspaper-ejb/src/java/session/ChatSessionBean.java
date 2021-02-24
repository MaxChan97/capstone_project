/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.messagingEntities.Chat;
import entity.messagingEntities.Message;
import entity.personEntities.Person;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Max
 */
@Stateless
public class ChatSessionBean implements ChatSessionBeanLocal {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Chat createChat(Long senderId, Long recipientId, Message message) {
        Person sender = em.find(Person.class, senderId);
        Person recipient = em.find(Person.class, recipientId);

        Chat newChat = new Chat();
        List<Person> chatParticipants = new ArrayList<Person>();
        chatParticipants.add(sender);
        chatParticipants.add(recipient);
        newChat.setChatParticipants(chatParticipants);
        
        message.setSender(sender);
        message.setRecipient(recipient);
        em.persist(message);
        newChat.addChatMessage(message);

        em.persist(newChat);

        List<Chat> person1Chat = sender.getChats();
        List<Chat> person2Chat = recipient.getChats();
        person1Chat.add(newChat);
        person2Chat.add(newChat);
        
        return newChat;
    }

    public Date getDateOfLastChatMessage(Chat chat) {
        if (chat.getChatMessages().size() != 0) {
            return chat.getChatMessages().get(chat.getChatMessages().size() - 1).getDateTime();
        } else {
            // not a valid case i.e. wont reach here, all chats will have at least
            // one msg
            return null;
        }
    }

    @Override
    public List<Chat> getPersonsChat(Long personId) {
        Person person = em.find(Person.class, personId);
        List<Chat> chats = person.getChats();
        for (Chat c : chats) {
            em.detach(c);
            List<Person> chatParticipants = c.getChatParticipants();
            for (Person p : chatParticipants) {
                em.detach(p);
                p.setChats(null);
                p.setPosts(null);
            }
            List<Message> chatMessages = c.getChatMessages();
            for (Message m : chatMessages) {
                em.detach(m.getSender());
                m.getSender().setChats(null);
                
                em.detach(m.getRecipient());
                m.getRecipient().setChats(null);
            }
        }
        // Must sort this chats before returning
        Collections.sort(chats, new Comparator<Chat>() {
            public int compare(Chat c1, Chat c2) {
                if (getDateOfLastChatMessage(c1) == null || getDateOfLastChatMessage(c2) == null) {
                    return 0;
                }
                return getDateOfLastChatMessage(c1).compareTo(getDateOfLastChatMessage(c2));
            }
        });
        return chats;
    }
}
