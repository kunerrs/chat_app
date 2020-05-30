
class Chatroom {
    constructor(room,username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addChat(message){
       //format a chat object
       const now = new Date();
       const chat = {

            // message: message or
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };

        //Save Chat Document
        const response = await this.chats.add(chat);
        return response;
    }

    getChats(callback){
       this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at')
            .onSnapshot( snapshot =>{
                snapshot.docChanges().forEach( change => {
                    if(change.type === 'added'){
                        // update UI ( handled by UI class not this class )
                        callback(change.doc.data());
                    }
                });
            });
    }

    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }
    
    updateRoom(room){
        this.room = room;
        console.log('Room Updated');
        if(this.unsub){
            this.unsub();
        }      
    }
}


