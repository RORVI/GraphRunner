docker exec -it kafka kafka-topics \
  --bootstrap-server kafka:9092 \
  --create \
  --topic test-topic \
  --partitions 1 \
  --replication-factor 1

# list the topics with this command
# docker exec -it kafka kafka-topics --bootstrap-server kafka:9092 --list

#delete a topic with this command

