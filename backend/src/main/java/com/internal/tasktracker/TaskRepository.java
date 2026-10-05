package com.internal.tasktracker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Search tasks by term, status filter, and optional assignee filter
    @Query(value = "SELECT * FROM tasks WHERE archived = FALSE "
                 + "AND (LOWER(title) LIKE :term OR LOWER(description) LIKE :term OR LOWER(assignee) LIKE :term) "
                 + "AND (CAST(:status AS VARCHAR) IS NULL OR status = CAST(:status AS VARCHAR)) "
                 + "AND (CAST(:assignee AS VARCHAR) IS NULL OR LOWER(assignee) = LOWER(CAST(:assignee AS VARCHAR))) "
                 + "ORDER BY created_at DESC",
           nativeQuery = true)
    List<Task> searchTasks(@Param("term") String term, @Param("status") String status, @Param("assignee") String assignee);
}
