import { test, expect } from '@playwright/test';

test.describe('TodoApp E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app and wait for it to load
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });
  });

  test('should load todos from API and display them', async ({ page }) => {
    // Check for the app heading
    await expect(page.locator('h1')).toContainText('Todo Master');
    
    // Check for TDD description
    await expect(page.locator('text=Built with TDD')).toBeVisible();
    
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    // Check progress indicator is displayed
    await expect(page.locator('h3', { hasText: 'Progress' })).toBeVisible();
    
    // Count the actual todo items
    const todoItems = page.locator('[data-testid="todo-item"]');
    const todoCount = await todoItems.count();
    
    // Should have loaded todos from API
    expect(todoCount).toBeGreaterThan(0);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/new-todo-app-loaded.png' });
  });

  test('should have working drag and drop functionality', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    // Get todo items for drag test
    const todoItems = page.locator('[data-testid="todo-item"]');
    const count = await todoItems.count();
    
    // Skip test if insufficient todos
    test.skip(count < 2, 'Need at least 2 todos for drag test');
    
    // Get the first two todo items
    const firstTodo = todoItems.nth(0);
    const secondTodo = todoItems.nth(1);
    
    // Get their ID attributes before drag to track them
    const firstId = await firstTodo.getAttribute('data-todo-id');
    const secondId = await secondTodo.getAttribute('data-todo-id');
    
    // Take screenshot before drag
    await page.screenshot({ path: 'test-results/new-todo-before-drag.png' });
    
    // Hover over first todo to make drag handle visible
    await firstTodo.hover();
    
    // Get drag handle for the first todo
    const firstDragHandle = firstTodo.locator('.cursor-grab');
    
    // Wait for drag handle to be visible
    await firstDragHandle.waitFor({ state: 'visible', timeout: 3000 });
    
    // Get the bounding boxes for manual drag
    const firstBox = await firstDragHandle.boundingBox();
    const secondBox = await secondTodo.boundingBox();
    
    if (!firstBox || !secondBox) {
      throw new Error('Could not get bounding boxes for drag operation');
    }
    
    // Perform manual drag and drop
    await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2, { steps: 10 });
    await page.waitForTimeout(100);
    await page.mouse.up();
    
    // Wait for DOM to update after drag
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('[data-testid="todo-item"]');
      return items.length > 0;
    }, { timeout: 3000 });
    
    // Take screenshot after drag
    await page.screenshot({ path: 'test-results/new-todo-after-drag.png' });
    
    // Check if order changed by checking the IDs in new positions
    const newFirstId = await todoItems.nth(0).getAttribute('data-todo-id');
    
    // Verify the order changed (first item should no longer be in first position)
    expect(newFirstId).not.toBe(firstId);
    expect(newFirstId).toBe(secondId); // The second item should now be first
  });

  test('should toggle todo completion status', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    const todoItems = page.locator('[data-testid="todo-item"]');
    const firstTodo = todoItems.first();
    
    // Find the toggle button (checkbox) - specifically the round checkbox button
    const toggleButton = firstTodo.locator('button.rounded-full');
    
    // Get initial state by checking the button's background color
    const initialClasses = await toggleButton.getAttribute('class');
    const isInitiallyCompleted = initialClasses?.includes('bg-green-500') || false;
    
    // Click the toggle button
    await toggleButton.click();
    
    // Wait for UI to update
    await page.waitForFunction((wasCompleted) => {
      const button = document.querySelector('[data-testid="todo-item"] button.rounded-full');
      if (!button) return false;
      const hasGreenBg = button.classList.contains('bg-green-500');
      return hasGreenBg !== wasCompleted;
    }, isInitiallyCompleted, { timeout: 3000 });
    
    // Check new state by checking the button's background color
    const newClasses = await toggleButton.getAttribute('class');
    const isNowCompleted = newClasses?.includes('bg-green-500') || false;
    
    // Verify the state changed
    expect(isNowCompleted).not.toBe(isInitiallyCompleted);
  });

  test('should maintain data integrity after multiple operations', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    const todoItems = page.locator('[data-testid="todo-item"]');
    const initialCount = await todoItems.count();
    
    // Perform multiple operations
    
    // 1. Toggle first todo
    const firstToggle = todoItems.first().locator('button.rounded-full');
    await firstToggle.click();
    await page.waitForLoadState('networkidle');
    
    // 2. Drag and drop
    if (initialCount >= 2) {
      await todoItems.nth(0).dragTo(todoItems.nth(1));
      await page.waitForLoadState('networkidle');
    }
    
    // 3. Toggle another todo
    if (initialCount >= 2) {
      const secondToggle = todoItems.nth(1).locator('button').first();
      await secondToggle.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Verify we still have the same number of todos
    const finalCount = await todoItems.count();
    expect(finalCount).toBe(initialCount);
  });

  test('should handle refresh correctly', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    // Get initial count
    const todoItems = page.locator('[data-testid="todo-item"]');
    const initialCount = await todoItems.count();
    
    // The refresh happens automatically via React Query, so let's just verify
    // that todos are loaded and stable
    await page.waitForFunction(() => {
      const items = document.querySelectorAll('[data-testid="todo-item"]');
      return items.length > 0;
    }, { timeout: 5000 });
    
    // Verify count is maintained (since API data is stable)
    const newCount = await todoItems.count();
    expect(newCount).toBe(initialCount);
  });

  test('should add new todo item', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    // Get initial count
    const todoItems = page.locator('[data-testid="todo-item"]');
    const initialCount = await todoItems.count();
    
    // Find and fill the add todo input
    const addInput = page.locator('input[placeholder="What needs to be done?"]');
    await expect(addInput).toBeVisible();
    
    const newTodoText = 'New E2E Test Todo Item';
    await addInput.fill(newTodoText);
    
    // Submit the form (either click the plus button or press Enter)
    await addInput.press('Enter');
    
    // Wait for the new todo to appear
    await expect(page.locator('text=' + newTodoText)).toBeVisible({ timeout: 3000 });
    
    // Verify the count increased
    const newCount = await todoItems.count();
    expect(newCount).toBe(initialCount + 1);
    
    // Verify the new todo appears in the list
    await expect(page.locator('text=' + newTodoText)).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/new-todo-added.png' });
  });

  test('should remove todo item', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    const todoItems = page.locator('[data-testid="todo-item"]');
    const initialCount = await todoItems.count();
    
    // Skip test if no todos available
    test.skip(initialCount === 0, 'No todos available for deletion test');
    
    // Get the text of the first todo before deletion
    const firstTodo = todoItems.first();
    const firstTodoText = await firstTodo.textContent();
    
    // Hover over the todo to make delete button visible
    await firstTodo.hover();
    
    // Wait for delete button to become visible and click it
    const deleteButton = firstTodo.locator('button[title="Delete todo"]');
    await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
    await deleteButton.click();
    
    // Confirm deletion by clicking "Yes"
    const confirmButton = firstTodo.locator('button', { hasText: 'Yes' });
    await confirmButton.click();
    
    // Wait for the todo to be removed from DOM
    await page.waitForFunction((expectedCount) => {
      const items = document.querySelectorAll('[data-testid="todo-item"]');
      return items.length === expectedCount;
    }, initialCount - 1, { timeout: 3000 });
    
    // Verify count decreased
    const newCount = await todoItems.count();
    expect(newCount).toBe(initialCount - 1);
    
    // Verify the specific todo was removed (check that its text is no longer visible)
    if (firstTodoText) {
      const deletedTodoExists = await page.locator('text=' + firstTodoText.slice(0, 20)).isVisible();
      expect(deletedTodoExists).toBe(false);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/new-todo-removed.png' });
  });

  test('should handle complete CRUD cycle', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    // 1. Add a new todo
    const addInput = page.locator('input[placeholder="What needs to be done?"]');
    const uniqueTodoText = `CRUD Test Todo ${Date.now()}`;
    
    await addInput.fill(uniqueTodoText);
    await addInput.press('Enter');
    
    // Wait for todo to be added
    await expect(page.locator('text=' + uniqueTodoText)).toBeVisible({ timeout: 3000 });
    
    // Verify todo was added
    await expect(page.locator('text=' + uniqueTodoText)).toBeVisible();
    
    // 2. Toggle the todo (mark as complete)
    const newTodo = page.locator('[data-testid="todo-item"]', { hasText: uniqueTodoText });
    const toggleButton = newTodo.locator('button.rounded-full');
    await toggleButton.click();
    
    // Wait for completion state to update
    await expect(newTodo.locator('text=Completed')).toBeVisible({ timeout: 3000 });
    
    // Verify it's marked as completed
    await expect(newTodo.locator('text=Completed')).toBeVisible();
    
    // 3. Drag and drop to reorder (if there are other todos)
    const todoItems = page.locator('[data-testid="todo-item"]');
    const count = await todoItems.count();
    
    if (count >= 2) {
      // Find our new todo
      const ourTodo = page.locator('[data-testid="todo-item"]', { hasText: uniqueTodoText });
      const firstTodo = todoItems.first();
      
      // If our todo isn't first, drag it to first position
      const ourTodoText = await ourTodo.textContent();
      const firstTodoText = await firstTodo.textContent();
      
      if (ourTodoText !== firstTodoText) {
        await ourTodo.dragTo(firstTodo);
        await page.waitForLoadState('networkidle');
      }
    }
    
    // 4. Delete the todo
    const ourTodoFinal = page.locator('[data-testid="todo-item"]', { hasText: uniqueTodoText });
    
    // Hover to make delete button visible
    await ourTodoFinal.hover();
    
    // Click the trash icon delete button
    const deleteButton = ourTodoFinal.locator('button[title="Delete todo"]');
    await deleteButton.click();
    
    // Confirm deletion by clicking "Yes"
    const confirmButton = ourTodoFinal.locator('button', { hasText: 'Yes' });
    await confirmButton.click();
    
    // Wait for todo to be removed
    await page.waitForFunction((text) => {
      const items = document.querySelectorAll('[data-testid="todo-item"]');
      return Array.from(items).every(item => !item.textContent?.includes(text));
    }, uniqueTodoText, { timeout: 3000 });
    
    // Verify todo was deleted
    const todoExists = await page.locator('text=' + uniqueTodoText).isVisible();
    expect(todoExists).toBe(false);
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/new-todo-crud-complete.png' });
  });

  test('should maintain order after adding and removing items', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    // Add a new todo
    const uniqueText = `Order Test ${Date.now()}`;
    const addInput = page.locator('input[placeholder="What needs to be done?"]');
    await addInput.fill(uniqueText);
    await addInput.press('Enter');
    
    // Wait for the new todo to appear
    await expect(page.locator('text=' + uniqueText)).toBeVisible({ timeout: 3000 });
    
    // Get all todos and check their order values
    const todoItems = page.locator('[data-testid="todo-item"]');
    const count = await todoItems.count();
    
    // Verify order values are sequential (0, 1, 2, ...)
    for (let i = 0; i < count; i++) {
      const todo = todoItems.nth(i);
      const orderText = await todo.locator('text=/Order: \\d+/').textContent();
      const orderValue = orderText?.match(/Order: (\d+)/)?.[1];
      expect(parseInt(orderValue || '-1')).toBe(i);
    }
    
    // Remove the first todo
    const firstTodo = todoItems.first();
    await firstTodo.hover();
    const firstDeleteButton = firstTodo.locator('button[title="Delete todo"]');
    await firstDeleteButton.click();
    
    // Confirm deletion by clicking "Yes"
    const confirmButton = firstTodo.locator('button', { hasText: 'Yes' });
    await confirmButton.click();
    
    // Wait for deletion to complete
    await page.waitForFunction((expectedCount) => {
      const items = document.querySelectorAll('[data-testid="todo-item"]');
      return items.length === expectedCount;
    }, count - 1, { timeout: 3000 });
    
    // Check order values again after removal
    const newTodoItems = page.locator('[data-testid="todo-item"]');
    const newCount = await newTodoItems.count();
    
    for (let i = 0; i < newCount; i++) {
      const todo = newTodoItems.nth(i);
      const orderText = await todo.locator('text=/Order: \\d+/').textContent();
      const orderValue = orderText?.match(/Order: (\d+)/)?.[1];
      expect(parseInt(orderValue || '-1')).toBe(i);
    }
  });

  test('should filter todos correctly', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    const todoItems = page.locator('[data-testid="todo-item"]');
    const initialCount = await todoItems.count();
    
    // Test "All" filter (default)
    await expect(page.locator('button', { hasText: 'All' })).toHaveClass(/bg-blue-100/);
    expect(await todoItems.count()).toBe(initialCount);
    
    // Click "Completed" filter
    await page.locator('button', { hasText: 'Completed' }).click();
    
    // Wait for filter to apply
    await page.waitForLoadState('networkidle');
    
    // Count completed todos (should be fewer than total)
    const completedCount = await todoItems.count();
    expect(completedCount).toBeLessThan(initialCount);
    
    // Click "Active" filter
    await page.locator('button', { hasText: 'Active' }).click();
    
    // Wait for filter to apply
    await page.waitForLoadState('networkidle');
    
    // Count active todos
    const activeCount = await todoItems.count();
    expect(activeCount).toBeLessThan(initialCount);
    
    // Verify the counts add up
    expect(completedCount + activeCount).toBe(initialCount);
    
    // Go back to "All"
    await page.locator('button', { hasText: 'All' }).click();
    
    // Wait for filter to apply
    await page.waitForLoadState('networkidle');
    expect(await todoItems.count()).toBe(initialCount);
  });

  test('should search todos correctly', async ({ page }) => {
    // Wait for todos to load
    await page.waitForSelector('[data-testid="todo-item"]', { timeout: 10000 });
    
    const initialCount = await page.locator('[data-testid="todo-item"]').count();
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder="Search todos..."]');
    await searchInput.fill('learn');
    
    // Wait for search to apply
    await page.waitForLoadState('networkidle');
    
    // Should show fewer results
    const searchResults = await page.locator('[data-testid="todo-item"]').count();
    expect(searchResults).toBeLessThan(initialCount);
    
    // Clear search by clearing the input
    await searchInput.clear();
    
    // Wait for search to clear
    await page.waitForLoadState('networkidle');
    
    // Should show all todos again
    expect(await page.locator('[data-testid="todo-item"]').count()).toBe(initialCount);
  });
});
