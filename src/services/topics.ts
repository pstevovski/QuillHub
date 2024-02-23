import handleErrorMessage from "@/utils/handleErrorMessage";
import db from "@/db/connection";
import { TopicNew, schemaTopics } from "@/db/schema/topics";
import { eq, inArray } from "drizzle-orm";
import { ApiErrorMessage } from "@/app/api/handleApiError";
import UsersService from "./users";

class Topics {
  /** Construct a slug based on the name of the topic */
  private generateUniqueTopicSlug(name: string): string {
    return name.split(" ").join("-").toLowerCase();
  }

  /** Get a list of all existing topics in the system */
  async getAll() {
    try {
      const topics = await db.select().from(schemaTopics);
      return topics;
    } catch (error) {
      console.log(
        `TOPICS - Failed getting existing topics: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Get a specifically targeted topic
   *
   * @param id The ID of the topic
   * @returns The targeted topic (if it exists) or throws an error
   *
   */
  async getSpecifc(id: number) {
    try {
      const targetedTopic = await db
        .select()
        .from(schemaTopics)
        .where(eq(schemaTopics.id, id));

      // Error out if topic cannot be found
      if (!targetedTopic[0]) throw new Error(ApiErrorMessage.NOT_FOUND);

      return targetedTopic[0];
    } catch (error) {
      console.log(
        `TOPICS - Failed getting topic with ID ${id}: ${handleErrorMessage(
          error
        )}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Create a new topic
   *
   * Note: The userID will be handled within the method itself
   *
   * @param userId The ID of the currently logged in user that is creating the topic
   * @param name The name of the topic
   *
   */
  async create(name: string): Promise<TopicNew> {
    try {
      const currentUser = await UsersService.getCurrentUser();

      const createdTopic: TopicNew = {
        name,
        slug: this.generateUniqueTopicSlug(name),
        created_by: currentUser.id,
      };

      await db.insert(schemaTopics).values(createdTopic);

      return createdTopic;
    } catch (error) {
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Delete the specifically targeted topic
   *
   * @param id The ID of the topic saved in the database
   *
   */
  async deleteSpecific(id: number) {
    try {
      const targetedTopic = await db
        .select()
        .from(schemaTopics)
        .where(eq(schemaTopics.id, id));

      // Throw error if topic does not exist in the database
      if (!targetedTopic[0]) throw new Error(ApiErrorMessage.NOT_FOUND);

      // Check for authorization before allowing deletion
      const currentUser = await UsersService.getCurrentUser();
      if (targetedTopic[0].created_by !== currentUser.id) {
        throw new Error(ApiErrorMessage.UNAUTHORIZED);
      }

      await db.delete(schemaTopics).where(eq(schemaTopics.id, id));
      console.log(`TOPICS - Successfully deleted topic with ID ${id}`);
    } catch (error) {
      console.log(
        `TOPICS - Failed deleting topic: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }

  /**
   *
   * Delete multiple selected topics at once
   *
   * @param ids The IDs of the topics that were selected for deletion
   *
   */
  async deleteBulk(ids: number[]) {
    try {
      const targetedTopics = await db
        .select()
        .from(schemaTopics)
        .where(inArray(schemaTopics.id, ids));

      if (!targetedTopics.length) throw new Error(ApiErrorMessage.NOT_FOUND);

      // Check if the user that tries deleting the topics is the one that created them
      const user = await UsersService.getCurrentUser();
      if (!targetedTopics.every((topic) => topic.created_by === user.id)) {
        throw new Error(ApiErrorMessage.UNAUTHORIZED);
      }

      await db.delete(schemaTopics).where(inArray(schemaTopics.id, ids));
      console.log(`TOPICS - Successfully removed ${ids.length} topics!`);
    } catch (error) {
      console.log(
        `TOPICS - Failed bulk topics deletion: ${handleErrorMessage(error)}`
      );
      throw new Error(handleErrorMessage(error));
    }
  }
}

const TopicsService = new Topics();

export default TopicsService;
