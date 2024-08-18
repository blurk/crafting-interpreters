#include <stdio.h>
#include <stdlib.h>

struct Node
{
	int data;
	struct Node *prev;
	struct Node *next;
};

struct Node *head = NULL;
struct Node *tail = NULL;

struct Node *create_new_node(int data)
{
	struct Node *new_node = malloc(sizeof(struct Node));

	new_node->data = data;
	new_node->prev = NULL;
	new_node->next = NULL;

	return new_node;
}

// Insert

void insert_at_head(struct Node *node)
{
	if (head == NULL)
	{
		head = node;
		tail = node;
	}
	else
	{
		node->next = head;
		head->prev = node;
		head = node;
	}
}

void insert_at_tail(struct Node *node)
{
	if (tail == NULL)
	{
		tail = node;
		head = node;
	}
	else
	{
		node->prev = tail;
		tail->next = node;
		tail = node;
	}
}

// Delete
void delete_at_head()
{
	if (head == NULL)
	{
		return;
	}

	if (head == tail)
	{
		head = NULL;
		tail = NULL;
	}
	else
	{
		head = head->next;
		head->prev = NULL;
	}
}

void delete_at_tail()
{
	if (tail == NULL)
	{
		return;
	}

	if (head == tail)
	{
		head = NULL;
		tail = NULL;
	}
	else
	{
		tail = tail->prev;
		tail->next = NULL;
	}
}

// Find
void find(int query)
{
	if (head == NULL)
	{
		puts("404");
	}

	if (head == tail && head->data == query)
	{
		printf("Found at head\n", head->data);
	}
	else if (head == tail && head->data != query)
	{
		printf("Can't find %d\n", query);
	}
	else
	{
		struct Node *p = head;
		int count = 0;

		while (p != NULL)
		{
			if (p->data == query)
			{
				printf("Found %d at index %d\n", query, count);
				return;
			}
			else
			{
				count++;
				p = p->next;
			}
		}

		printf("Can't find %d\n", query);
	}
}

void display()
{
	struct Node *ptr = head;
	puts("Current doubly linked list:");
	while (ptr != NULL)
	{
		printf("%d\n", ptr->data);
		ptr = ptr->next;
	}
}

int main()
{

	struct Node *node_1 = create_new_node(0);
	struct Node *node_2 = create_new_node(1);
	struct Node *node_3 = create_new_node(2);
	struct Node *node_4 = create_new_node(3);
	struct Node *node_5 = create_new_node(4);
	struct Node *node_6 = create_new_node(5);
	struct Node *node_7 = create_new_node(6);

	insert_at_tail(node_1);
	insert_at_tail(node_2);
	insert_at_tail(node_3);
	insert_at_tail(node_4);
	insert_at_tail(node_5);
	insert_at_tail(node_6);
	insert_at_tail(node_7);
	display();

	delete_at_head();
	display();

	insert_at_head(node_1);
	delete_at_tail();
	display();

	find(0);
	find(3);
	find(6);
	find(-1);

	free(node_1);
	free(node_2);
	free(node_3);
	free(node_4);
	free(node_5);
	free(node_6);

	return 0;
}