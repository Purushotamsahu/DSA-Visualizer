export const linkedListCodeDocs = {
  singly: {
    traversal: `void traverse(Node* head) {
  Node* temp = head;
  while (temp != nullptr) {
    // Process temp->data
    temp = temp->next;
  }
}`,
    search: `bool search(Node* head, int key) {
  Node* temp = head;
  while (temp != nullptr) {
    if (temp->data == key) return true;
    temp = temp->next;
  }
  return false;
}`,
    insert: `void insertAtEnd(Node** head, int data) {
  Node* newNode = new Node(data);
  if (*head == nullptr) {
    *head = newNode;
    return;
  }
  Node* temp = *head;
  while (temp->next != nullptr) {
    temp = temp->next;
  }
  temp->next = newNode;
}`,
    delete: `void deleteNode(Node** head, int key) {
  Node* temp = *head;
  Node* prev = nullptr;
  if (temp != nullptr && temp->data == key) {
    *head = temp->next;
    delete temp;
    return;
  }
  while (temp != nullptr && temp->data != key) {
    prev = temp;
    temp = temp->next;
  }
  if (temp == nullptr) return;
  prev->next = temp->next;
  delete temp;
}`
  },
  doubly: {
    traversal: `void traverse(Node* head) {
  Node* temp = head;
  while (temp != nullptr) {
    temp = temp->next;
  }
}`,
    search: `bool search(Node* head, int key) {
  Node* temp = head;
  while (temp != nullptr) {
    if (temp->data == key) return true;
    temp = temp->next;
  }
  return false;
}`,
    insert: `void insert(Node** head, int data, int pos) {
  Node* newNode = new Node(data);
  if (pos == 1) {
    newNode->next = *head;
    if (*head != nullptr) (*head)->prev = newNode;
    *head = newNode;
    return;
  }
  Node* temp = *head;
  for (int i = 1; temp != nullptr && i < pos - 1; i++) {
    temp = temp->next;
  }
  if (temp == nullptr) return;
  newNode->next = temp->next;
  newNode->prev = temp;
  if (temp->next != nullptr) temp->next->prev = newNode;
  temp->next = newNode;
}`,
    delete: `void deleteNode(Node** head, int key) {
  if (*head == nullptr) return;
  Node* temp = *head;
  if (temp->data == key) {
    *head = temp->next;
    if (*head != nullptr) (*head)->prev = nullptr;
    delete temp;
    return;
  }
  while (temp != nullptr && temp->data != key) {
    temp = temp->next;
  }
  if (temp == nullptr) return;
  if (temp->next != nullptr) temp->next->prev = temp->prev;
  if (temp->prev != nullptr) temp->prev->next = temp->next;
  delete temp;
}`
  },
  circular: {
    traversal: `void traverse(Node* head) {
  if (head == nullptr) return;
  Node* temp = head;
  do {
    temp = temp->next;
  } while (temp != head);
}`,
    search: `bool search(Node* head, int key) {
  if (head == nullptr) return false;
  Node* temp = head;
  do {
    if (temp->data == key) return true;
    temp = temp->next;
  } while (temp != head);
  return false;
}`,
    insert: `void insert(Node** head, int data, int pos) {
  Node* newNode = new Node(data);
  if (*head == nullptr) {
    newNode->next = newNode;
    *head = newNode;
    return;
  }
  if (pos == 1) {
    Node* last = *head;
    while (last->next != *head) last = last->next;
    newNode->next = *head;
    last->next = newNode;
    *head = newNode;
    return;
  }
  Node* temp = *head;
  for (int i = 1; i < pos - 1 && temp->next != *head; i++) {
    temp = temp->next;
  }
  newNode->next = temp->next;
  temp->next = newNode;
}`,
    delete: `void deleteNode(Node** head, int key) {
  if (*head == nullptr) return;
  Node *curr = *head, *prev = nullptr;
  while (curr->data != key) {
    if (curr->next == *head) return;
    prev = curr;
    curr = curr->next;
  }
  if (curr == *head && curr->next == *head) {
    *head = nullptr;
    delete curr;
    return;
  }
  if (curr == *head) {
    prev = *head;
    while (prev->next != *head) prev = prev->next;
    *head = curr->next;
    prev->next = *head;
    delete curr;
  } else {
    prev->next = curr->next;
    delete curr;
  }
}`
  },
  circularDoubly: {
    search: `bool search(Node* head, int key) {
  if (head == nullptr) return false;
  Node* temp = head;
  do {
    if (temp->data == key) return true;
    temp = temp->next;
  } while (temp != head);
  return false;
}`,
    insert: `void insert(Node** head, int data, int pos) {
  Node* newNode = new Node(data);
  if (*head == nullptr) {
    newNode->next = newNode;
    newNode->prev = newNode;
    *head = newNode;
    return;
  }
  if (pos == 1) {
    Node* last = (*head)->prev;
    newNode->next = *head;
    newNode->prev = last;
    (*head)->prev = newNode;
    last->next = newNode;
    *head = newNode;
    return;
  }
  Node* temp = *head;
  for (int i = 1; i < pos - 1 && temp->next != *head; i++) {
    temp = temp->next;
  }
  newNode->next = temp->next;
  newNode->prev = temp;
  temp->next->prev = newNode;
  temp->next = newNode;
}`,
    delete: `void deleteNode(Node** head, int key) {
  if (*head == nullptr) return;
  Node* temp = *head;
  Node* last = (*head)->prev;
  if (temp->data == key) {
    if (temp->next == temp) {
      *head = nullptr;
    } else {
      *head = temp->next;
      (*head)->prev = last;
      last->next = *head;
    }
    delete temp;
    return;
  }
  while (temp->next != *head && temp->data != key) {
    temp = temp->next;
  }
  if (temp->data != key) return;
  temp->prev->next = temp->next;
  temp->next->prev = temp->prev;
  delete temp;
}`
  }
};

export function* singlyLLTraversal(searchVal, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const target = typeof searchVal === 'object' ? (searchVal.searchVal || searchVal.val) : searchVal;
  
  yield { 
    description: `Searching for ${target} in Singly Linked List...`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'singly' } 
  };

  if (list.length === 0) {
    yield { description: "List is empty.", line: 2, linkedList: { nodes: [], headId: null, type: 'singly' } };
    return;
  }

  let currentId = headId;
  while (currentId !== null) {
    const node = list.find(n => n.id === currentId);
    if (!node) break;
    
    yield { 
      description: `Pointer 'temp' is at node with value ${node.val}. Comparing with ${target}.`, 
      line: 3, 
      linkedList: { nodes: [...list], headId, activeId: currentId, type: 'singly' } 
    };

    if (node.val === Number(target)) {
      yield { 
        description: `MATCH FOUND! Value ${target} is located at current node.`, 
        line: 4, 
        linkedList: { nodes: [...list], headId, activeId: currentId, foundId: currentId, type: 'singly' } 
      };
      return;
    }
    
    const prevId = currentId;
    currentId = node.next;
    
    if (currentId !== null) {
      yield { 
        description: `No match. Moving 'temp' to the next node: temp = temp->next.`, 
        line: 5, 
        linkedList: { nodes: [...list], headId, activeId: prevId, type: 'singly' } 
      };
    }
  }

  yield { 
    description: `Reached end of list (nullptr). Value ${target} not found.`, 
    line: 6, 
    linkedList: { nodes: [...list], headId, type: 'singly' } 
  };
}

export function* singlyLLInsert(val, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const newNodeVal = typeof val === 'object' ? val.val : val;
  const action = inputs?.action || 'tail'; // 'head', 'tail', 'index'
  const pos = Number(inputs?.pos) || 1;
  const newNodeId = Date.now() % 10000;

  yield { 
    description: `Target: Insert ${newNodeVal} at ${action.toUpperCase()}.`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'singly' } 
  };

  const newNode = { id: newNodeId, val: newNodeVal, next: null };

  // Case 1: Empty List
  if (list.length === 0) {
    yield { 
      description: "List is empty. Creating first node as head.", 
      line: 2, 
      linkedList: { nodes: [newNode], headId: newNodeId, activeId: newNodeId, type: 'singly' } 
    };
    return;
  }

  // Case 2: Insert at Head
  if (action === 'head' || (action === 'index' && pos <= 1)) {
    newNode.next = headId;
    yield { 
      description: "Pointed new node's 'next' to the current head.", 
      line: 2, 
      linkedList: { nodes: [...list, newNode], headId, activeId: newNodeId, type: 'singly' } 
    };
    yield { 
      description: "Updated head pointer to the new node.", 
      line: 3, 
      linkedList: { nodes: [...list, newNode], headId: newNodeId, activeId: newNodeId, type: 'singly' } 
    };
    return;
  }

  // Case 3: Insert at Index or Tail
  let currentId = headId;
  let currentIndex = 1;
  let prevId = null;

  // For 'tail', we go to the very last node.
  // For 'index', we go to 'pos' or the last node if 'pos' is too large.
  while (currentId !== null) {
      const node = list.find(n => n.id === currentId);
      yield { 
          description: `Traversing... Current node value: ${node.val} (index ${currentIndex})`, 
          line: 5, 
          linkedList: { nodes: [...list], headId, activeId: node.id, type: 'singly' } 
      };

      if (action === 'index' && currentIndex === pos - 1) {
          // Found insertion point: after this node
          break;
      }
      
      if (action === 'tail' && node.next === null) {
          // Found last node
          break;
      }

      prevId = currentId;
      currentId = node.next;
      currentIndex++;
      
      if (currentId === null) {
          // If index is larger than list length, it defaults to tail
          break;
      }
  }

  // Final insertion logic (currentId is the node AFTER which we insert)
  const targetNode = list.find(n => n.id === (currentId || prevId));
  newNode.next = targetNode.next;
  const newList = list.map(n => n.id === targetNode.id ? { ...n, next: newNodeId } : n);
  
  yield { 
    description: `Linked node ${targetNode.val} to the new node, and new node to the rest of the list.`, 
    line: 15, 
    linkedList: { nodes: [...newList, newNode], headId, activeId: newNodeId, type: 'singly' } 
  };
}

export function* singlyLLDelete(val, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const action = inputs?.action || 'tail'; // 'head', 'tail', 'value'
  const targetVal = typeof val === 'object' ? val.searchVal || val.val : val;

  if (list.length === 0) {
    yield { description: "List is already empty.", line: 1, linkedList: { nodes: [], headId: null, type: 'singly' } };
    return;
  }

  yield { 
    description: `Target: Delete ${action.toUpperCase()}.`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'singly' } 
  };

  if (action === 'head') {
    const newHeadId = list.find(n => n.id === headId)?.next;
    const newList = list.filter(n => n.id !== headId);
    yield { 
      description: "Updated head to point to head->next. Initial head is now unlinked.", 
      line: 2, 
      linkedList: { nodes: newList, headId: newHeadId, type: 'singly' } 
    };
  } else if (action === 'value' || action === 'index') {
    let targetNode = null;
    if (action === 'value') {
      targetNode = list.find(n => n.val === targetVal);
    } else {
      // index
      let curr = headId;
      let idx = 1;
      while (curr !== null) {
        if (idx === pos) {
          targetNode = list.find(n => n.id === curr);
          break;
        }
        const node = list.find(n => n.id === curr);
        curr = node.next;
        idx++;
      }
    }

    if (!targetNode) {
        yield { description: `${action === 'value' ? 'Value ' + targetVal : 'Index ' + pos} not found.`, line: 5, linkedList: { nodes: [...list], headId, type: 'singly' } };
        return;
    }

    yield { 
      description: `Searching... Found ${action === 'value' ? 'value ' + targetVal : 'node at index ' + pos}. Redirection pointers...`, 
      line: 10, 
      linkedList: { nodes: [...list], headId, activeId: targetNode.id, type: 'singly' } 
    };
    
    const prevNode = list.find(n => n.next === targetNode.id);
    let newList = list.filter(n => n.id !== targetNode.id);
    let newHeadId = headId;
    
    if (prevNode) {
      newList = newList.map(n => n.id === prevNode.id ? { ...n, next: targetNode.next } : n);
    } else {
      newHeadId = targetNode.next;
    }

    yield { 
      description: `Node ${action === 'value' ? 'with value ' + targetVal : 'at index ' + pos} removed.`, 
      line: 15, 
      linkedList: { nodes: newList, headId: newHeadId, type: 'singly' } 
    };
  } else {
    // Tail
    if (list.length === 1) {
       yield { description: "Removing only node. List is now empty.", line: 15, linkedList: { nodes: [], headId: null, type: 'singly' } };
       return;
    }
    const tailNode = list[list.length - 1];
    const penultimateNode = list[list.length - 2];
    
    yield { 
      description: "Traversing to find the penultimate node.", 
      line: 10, 
      linkedList: { nodes: [...list], headId, activeId: penultimateNode.id, type: 'singly' } 
    };
    
    const newList = list.filter(n => n.id !== tailNode.id).map(n => n.id === penultimateNode.id ? { ...n, next: null } : n);
    yield { 
      description: "Set temp->next to nullptr. Last node is unlinked.", 
      line: 15, 
      linkedList: { nodes: newList, headId, activeId: penultimateNode.id, type: 'singly' } 
    };
  }
}


export function* doublyLLTraversal(searchVal, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const target = typeof searchVal === 'object' ? (searchVal.searchVal || searchVal.val) : searchVal;

  yield { 
    description: `Searching for ${target} in Doubly Linked List...`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'doubly' } 
  };

  if (list.length === 0) {
    yield { description: "List is empty.", line: 1, linkedList: { nodes: [], headId: null, type: 'doubly' } };
    return;
  }

  let currentId = headId;
  while (currentId !== null) {
    const node = list.find(n => n.id === currentId);
    if (!node) break;
    
    yield { 
      description: `Checking node ${node.val}. It has pointers to both next and previous.`, 
      line: 3, 
      linkedList: { nodes: [...list], headId, activeId: node.id, type: 'doubly' } 
    };

    if (node.val === Number(target)) {
      yield { 
        description: `Found value ${target}!`, 
        line: 4, 
        linkedList: { nodes: [...list], headId, activeId: node.id, foundId: node.id, type: 'doubly' } 
      };
      return;
    }
    currentId = node.next;
  }

  yield { description: `Value ${target} not found.`, line: 6, linkedList: { nodes: [...list], headId, type: 'doubly' } };
}

export function* doublyLLInsert(val, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const newNodeVal = typeof val === 'object' ? val.val : val;
  const action = inputs?.action || 'tail'; // 'head', 'tail', 'index'
  const pos = Number(inputs?.pos) || 1;
  const newNodeId = Date.now() % 10000;

  yield { 
    description: `Target: Insert ${newNodeVal} at ${action.toUpperCase()}.`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'doubly' } 
  };

  const newNode = { id: newNodeId, val: newNodeVal, next: null, prev: null };

  // Case 1: Empty List
  if (list.length === 0) {
    yield { 
      description: "List is empty. Creating first node as head.", 
      line: 3, 
      linkedList: { nodes: [newNode], headId: newNodeId, activeId: newNodeId, type: 'doubly' } 
    };
    return;
  }

  // Case 2: Insert at Head
  if (action === 'head' || (action === 'index' && pos <= 1)) {
    newNode.next = headId;
    yield { 
      description: "Step 1: Set new node's 'next' to the current head.", 
      line: 4, 
      linkedList: { nodes: [...list, newNode], headId, activeId: newNodeId, type: 'doubly' } 
    };
    
    const newList = list.map(n => n.id === headId ? { ...n, prev: newNodeId } : n);
    yield { 
      description: "Step 2: Update old head's 'prev' to point to the new node.", 
      line: 5, 
      linkedList: { nodes: [...newList, newNode], headId, activeId: headId, type: 'doubly' } 
    };

    yield { 
      description: "Step 3: Update head pointer to the new node.", 
      line: 6, 
      linkedList: { nodes: [...newList, newNode], headId: newNodeId, activeId: newNodeId, type: 'doubly' } 
    };
    return;
  }

  // Case 3: Insert at Index or Tail
  let currentId = headId;
  let currentIndex = 1;
  let prevId = null;

  while (currentId !== null) {
      const node = list.find(n => n.id === currentId);
      yield { 
          description: `Traversing... current node value: ${node.val} (index ${currentIndex})`, 
          line: 10, 
          linkedList: { nodes: [...list], headId, activeId: node.id, type: 'doubly' } 
      };

      if (action === 'index' && currentIndex === pos - 1) break;
      if (action === 'tail' && node.next === null) break;

      prevId = currentId;
      currentId = node.next;
      currentIndex++;
      if (currentId === null) break;
  }

  const tempNode = list.find(n => n.id === (currentId || prevId));
  newNode.prev = tempNode.id;
  newNode.next = tempNode.next;

  yield { 
      description: `Step 1: Set new node's 'prev' and 'next' pointers.`, 
      line: 14, 
      linkedList: { nodes: [...list, newNode], headId, activeId: newNodeId, type: 'doubly' } 
  };

  let newList = [...list];
  if (tempNode.next !== null) {
      const nextNodeId = tempNode.next;
      newList = newList.map(n => n.id === nextNodeId ? { ...n, prev: newNodeId } : n);
      yield { 
          description: `Step 2: Update next node's 'prev' to point to new node.`, 
          line: 17, 
          linkedList: { nodes: [...newList, newNode], headId, activeId: nextNodeId, type: 'doubly' } 
      };
  }

  newList = newList.map(n => n.id === tempNode.id ? { ...n, next: newNodeId } : n);
  yield { 
      description: `Step 3: Update current node's 'next' to point to new node.`, 
      line: 18, 
      linkedList: { nodes: [...newList, newNode], headId, activeId: tempNode.id, type: 'doubly' } 
  };
}

export function* doublyLLDelete(val, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const action = inputs?.action || 'head'; // 'head', 'tail', 'value'
  const targetVal = typeof val === 'object' ? val.searchVal || val.val : val;

  if (list.length === 0) {
    yield { description: "List is empty.", line: 2, linkedList: { nodes: [], headId: null, type: 'doubly' } };
    return;
  }

  yield { 
    description: `Target: Delete ${action.toUpperCase()} from Doubly LL.`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'doubly' } 
  };

  if (action === 'head') {
    const headNode = list.find(n => n.id === headId);
    const newHeadId = headNode?.next;
    
    yield { 
      description: "Step 1: Set head pointer to the second node.", 
      line: 6, 
      linkedList: { nodes: [...list], headId: newHeadId, activeId: headId, type: 'doubly' } 
    };

    let newList = list.filter(n => n.id !== headId);
    if (newHeadId) {
      newList = newList.map(n => n.id === newHeadId ? { ...n, prev: null } : n);
      yield { 
        description: "Step 2: Set new head's 'prev' to NULL.", 
        line: 7, 
        linkedList: { nodes: newList, headId: newHeadId, activeId: newHeadId, type: 'doubly' } 
      };
    }
    yield { 
      description: "Step 3: Old head node is deleted.", 
      line: 8, 
      linkedList: { nodes: newList, headId: newHeadId, type: 'doubly' } 
    };
  } else if (action === 'value' || action === 'index') {
    let currentId = headId;
    let targetNode = null;
    let currIdx = 1;
    while (currentId !== null) {
      const node = list.find(n => n.id === currentId);
      yield { 
        description: `Traversing... current ${action === 'index' ? 'index: ' + currIdx : 'value: ' + node.val}.`, 
        line: 11, 
        linkedList: { nodes: [...list], headId, activeId: node.id, type: 'doubly' } 
      };
      if (action === 'value' && node.val === Number(targetVal)) {
        targetNode = node;
        break;
      }
      if (action === 'index' && currIdx === pos) {
        targetNode = node;
        break;
      }
      currentId = node.next;
      currIdx++;
    }

    if (!targetNode) {
      yield { description: `${action === 'value' ? 'Value ' + targetVal : 'Index ' + pos} not found.`, line: 14, linkedList: { nodes: [...list], headId, type: 'doubly' } };
      return;
    }

    if (targetNode.id === headId) {
       yield* doublyLLDelete(targetVal, { ...inputs, action: 'head' });
       return;
    }

    const prevNodeId = targetNode.prev;
    const nextNodeId = targetNode.next;

    let newList = [...list];
    if (prevNodeId !== null) {
      newList = newList.map(n => n.id === prevNodeId ? { ...n, next: nextNodeId } : n);
      yield { 
        description: `Step 1: Link previous node directly to the next node.`, 
        line: 17, 
        linkedList: { nodes: [...newList], headId, activeId: prevNodeId, type: 'doubly' } 
      };
    }

    if (nextNodeId !== null) {
      newList = newList.map(n => n.id === nextNodeId ? { ...n, prev: prevNodeId } : n);
      yield { 
        description: `Step 2: Link next node's 'prev' back to the previous node.`, 
        line: 16, 
        linkedList: { nodes: [...newList], headId, activeId: nextNodeId, type: 'doubly' } 
      };
    }

    newList = newList.filter(n => n.id !== targetNode.id);
    yield { 
      description: `Step 3: Node ${action === 'value' ? 'with value ' + targetVal : 'at index ' + pos} removed.`, 
      line: 18, 
      linkedList: { nodes: newList, headId, type: 'doubly' } 
    };
  } else {
    // Tail
    if (list.length === 1) {
       yield { description: "Removing the only node. List now empty.", line: 2, linkedList: { nodes: [], headId: null, type: 'doubly' } };
       return;
    }
    
    let currentId = headId;
    let tailNode = null;
    while (currentId !== null) {
      const node = list.find(n => n.id === currentId);
      if (node.next === null) {
        tailNode = node;
        break;
      }
      yield { 
        description: "Traversing to find the tail node...", 
        line: 11, 
        linkedList: { nodes: [...list], headId, activeId: node.id, type: 'doubly' } 
      };
      currentId = node.next;
    }

    const prevNodeId = tailNode.prev;
    const newList = list.filter(n => n.id !== tailNode.id).map(n => n.id === prevNodeId ? { ...n, next: null } : n);
    
    yield { 
      description: "Updated previous node's 'next' to NULL. Tail node is unlinked.", 
      line: 17, 
      linkedList: { nodes: newList, headId, activeId: prevNodeId, type: 'doubly' } 
    };
  }
}

export function* circularLLTraversal(searchVal, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const target = typeof searchVal === 'object' ? (searchVal.searchVal || searchVal.val) : searchVal;

  yield { 
    description: `Searching for ${target} in Circular Linked List...`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'circular' } 
  };

  if (list.length === 0) {
    yield { description: "List is empty.", line: 1, linkedList: { nodes: [], headId: null, type: 'circular' } };
    return;
  }

  let currentId = headId;
  let firstPass = true;
  while (currentId !== headId || firstPass) {
    firstPass = false;
    const node = list.find(n => n.id === currentId);
    if (!node) break;

    yield { 
      description: `Visiting node ${node.val}. Observe the link back from last node.`, 
      line: 5, 
      linkedList: { nodes: [...list], headId, activeId: currentId, type: 'circular' } 
    };

    if (node.val === Number(target)) {
      yield { 
        description: `Found ${target}!`, 
        line: 8, 
        linkedList: { nodes: [...list], headId, activeId: currentId, foundId: currentId, type: 'circular' } 
      };
      return;
    }
    currentId = node.next;
  }

  yield { description: `Value ${target} not found.`, line: 10, linkedList: { nodes: [...list], headId, type: 'circular' } };
}

export function* circularLLInsert(val, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const newVal = typeof val === 'object' ? val.val : val;
  const action = inputs?.action || 'tail';
  const pos = inputs?.pos || 1;
  const newNodeId = Date.now() % 10000;

  yield { 
    description: `Target: Insert ${newVal} into Circular LL at ${action.toUpperCase()}.`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'circular' } 
  };

  const newNode = { id: newNodeId, val: newVal, next: null };

  if (list.length === 0) {
    newNode.next = newNodeId;
    yield { 
      description: "Creating first node in Circular LL. It points back to itself.", 
      line: 2, 
      linkedList: { nodes: [newNode], headId: newNodeId, activeId: newNodeId, type: 'circular' } 
    };
    return;
  }

  // Traverse to find the tail (node that points to headId)
  let currentId = headId;
  let tailNode = null;
  const visited = new Set();
  while (currentId !== null && !visited.has(currentId)) {
      visited.add(currentId);
      const node = list.find(n => n.id === currentId);
      yield { 
          description: `Traversing... at node ${node.val}`, 
          line: 5, 
          linkedList: { nodes: [...list], headId, activeId: node.id, type: 'circular' } 
      };
      if (node.next === headId) {
          tailNode = node;
          break;
      }
      currentId = node.next;
  }

  if (action === 'head' || (action === 'index' && pos <= 1)) {
    newNode.next = headId;
    const newList = list.map(n => n.id === tailNode.id ? { ...n, next: newNodeId } : n);
    yield { 
      description: "Updating last node to point to new node, and new node to point to old head.", 
      line: 8, 
      linkedList: { nodes: [...newList, newNode], headId: headId, activeId: newNodeId, type: 'circular' } 
    };
    yield { 
        description: "Updated head pointer to the new node.", 
        line: 9, 
        linkedList: { nodes: [...newList, newNode], headId: newNodeId, activeId: newNodeId, type: 'circular' } 
      };
  } else if (action === 'index') {
    const headNode = list.find(n => n.id === headId);
    let curr = headNode;
    let idx = 1;
    while (idx < pos - 1 && curr.next !== headId) {
        curr = list.find(n => n.id === curr.next);
        idx++;
        yield { 
            description: `Traversing... at index ${idx}`, 
            line: 5, 
            linkedList: { nodes: [...list], headId, activeId: curr.id, type: 'circular' } 
        };
    }
    newNode.next = curr.next;
    const newList = list.map(n => n.id === curr.id ? { ...n, next: newNodeId } : n);
    yield { 
      description: `Linked new node after index ${idx}.`, 
      line: 15, 
      linkedList: { nodes: [...newList, newNode], headId, activeId: newNodeId, type: 'circular' } 
    };
  } else {
    // Tail
    newNode.next = headId;
    const newList = list.map(n => n.id === tailNode.id ? { ...n, next: newNodeId } : n);
    yield { 
      description: "Added new node at the end. Old tail points to new node, new node points to head.", 
      line: 15, 
      linkedList: { nodes: [...newList, newNode], headId, activeId: newNodeId, type: 'circular' } 
    };
  }
}

export function* circularLLDelete(val, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const action = inputs?.action || 'head';
  const targetVal = typeof val === 'object' ? val.searchVal || val.val : val;
  
  if (list.length === 0) return;

  yield { 
    description: `Target: Delete ${action.toUpperCase()} from Circular LL.`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'circular' } 
  };

  if (list.length === 1) {
    yield { description: "Removing only node. List is now empty.", line: 5, linkedList: { nodes: [], headId: null, type: 'circular' } };
    return;
  }

  const headNode = list.find(n => n.id === headId);
  const tailNode = list.find(n => n.next === headId);

  if (action === 'head') {
    const newHeadId = headNode.next;
    const newList = list.filter(n => n.id !== headId).map(n => n.id === tailNode.id ? { ...n, next: newHeadId } : n);
    yield { 
      description: "Updated tail's next to point to head->next. Head node removed.", 
      line: 5, 
      linkedList: { nodes: newList, headId: newHeadId, type: 'circular' } 
    };
  } else if (action === 'tail') {
    // Find penultimate node
    let penultimateNode = headNode;
    while (penultimateNode.next !== tailNode.id) {
        penultimateNode = list.find(n => n.id === penultimateNode.next);
    }
    const newList = list.filter(n => n.id !== tailNode.id).map(n => n.id === penultimateNode.id ? { ...n, next: headId } : n);
    yield { 
      description: "Updated penultimate node to point back to head. Tail node removed.", 
      line: 10, 
      linkedList: { nodes: newList, headId, type: 'circular' } 
    };
  } else if (action === 'value') {
    if (headNode.val === Number(targetVal)) {
        yield* circularLLDelete(val, { ...inputs, action: 'head' });
        return;
    }
    
    let prev = headNode;
    let curr = list.find(n => n.id === headNode.next);
    let found = false;
    
    while (curr.id !== headId) {
        if (curr.val === Number(targetVal)) {
            found = true;
            break;
        }
        prev = curr;
        curr = list.find(n => n.id === curr.next);
    }

    if (!found) {
        yield { description: `Value ${targetVal} not found in list.`, line: 15, linkedList: { nodes: [...list], headId, type: 'circular' } };
        return;
    }

    const newList = list.filter(n => n.id !== curr.id).map(n => n.id === prev.id ? { ...n, next: curr.next } : n);
    yield { 
      description: `Removed node with value ${targetVal}. Pointed previous node to next node.`, 
      line: 20, 
      linkedList: { nodes: newList, headId, type: 'circular' } 
    };
  }
}

export function* circularDoublyLLTraversal(searchVal, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const target = typeof searchVal === 'object' ? (searchVal.searchVal || searchVal.val) : searchVal;

  yield { 
    description: `Searching for ${target} in Circular Doubly Linked List...`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'circular-doubly' } 
  };

  if (list.length === 0) {
    yield { description: "List is empty.", line: 1, linkedList: { nodes: [], headId: null, type: 'circular-doubly' } };
    return;
  }

  let currentId = headId;
  let firstPass = true;
  while (currentId !== headId || firstPass) {
    firstPass = false;
    const node = list.find(n => n.id === currentId);
    if (!node) break;

    yield { 
      description: `Checking node ${node.val}. It has pointers to both next and previous.`, 
      line: 5, 
      linkedList: { nodes: [...list], headId, activeId: currentId, type: 'circular-doubly' } 
    };

    if (node.val === Number(target)) {
        yield { 
          description: `Found ${target}!`, 
          line: 8, 
          linkedList: { nodes: [...list], headId, activeId: currentId, foundId: currentId, type: 'circular-doubly' } 
        };
        return;
    }
    currentId = node.next;
  }
  yield { description: `Value ${target} not found.`, line: 10, linkedList: { nodes: [...list], headId, type: 'circular-doubly' } };
}

export function* circularDoublyLLInsert(val, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const newVal = typeof val === 'object' ? val.val : val;
  const action = inputs?.action || 'tail';
  const pos = inputs?.pos || 1;
  const newNodeId = Date.now() % 10000;

  yield { 
    description: `Target: Insert ${newVal} into Circular Doubly LL at ${action.toUpperCase()}.`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'circular-doubly' } 
  };

  const newNode = { id: newNodeId, val: newVal, next: null, prev: null };

  if (list.length === 0) {
    newNode.next = newNodeId;
    newNode.prev = newNodeId;
    yield { 
      description: "First node created. Points to itself as both next and prev.", 
      line: 2, 
      linkedList: { nodes: [newNode], headId: newNodeId, activeId: newNodeId, type: 'circular-doubly' } 
    };
    return;
  }

  const headNode = list.find(n => n.id === headId);
  const tailNode = list.find(n => n.id === headNode.prev);

  if (action === 'head' || (action === 'index' && pos <= 1)) {
    newNode.next = headId;
    newNode.prev = tailNode.id;
    const newList = list.map(n => {
        let updated = { ...n };
        if (n.id === headId) updated.prev = newNodeId;
        if (n.id === tailNode.id) updated.next = newNodeId;
        return updated;
    });
    yield { 
      description: "Linked newNode between tail and old head. Updated tail.next and oldHead.prev.", 
      line: 5, 
      linkedList: { nodes: [...newList, newNode], headId, activeId: newNodeId, type: 'circular-doubly' } 
    };
    yield { 
        description: "Updated head pointer to the new node.", 
        line: 8, 
        linkedList: { nodes: [...newList, newNode], headId: newNodeId, activeId: newNodeId, type: 'circular-doubly' } 
      };
  } else if (action === 'index') {
    let curr = headNode;
    let idx = 1;
    while (idx < pos - 1 && curr.next !== headId) {
        curr = list.find(n => n.id === curr.next);
        idx++;
        yield { 
            description: `Traversing... at index ${idx}`, 
            line: 5, 
            linkedList: { nodes: [...list], headId, activeId: curr.id, type: 'circular-doubly' } 
        };
    }
    const nextNodeId = curr.next;
    newNode.next = nextNodeId;
    newNode.prev = curr.id;
    const newList = list.map(n => {
        let updated = { ...n };
        if (n.id === curr.id) updated.next = newNodeId;
        if (n.id === nextNodeId) updated.prev = newNodeId;
        return updated;
    });
    yield { 
      description: `Linked new node after index ${idx}. Updated neighbors.`, 
      line: 15, 
      linkedList: { nodes: [...newList, newNode], headId, activeId: newNodeId, type: 'circular-doubly' } 
    };
  } else {
    // Tail
    newNode.next = headId;
    newNode.prev = tailNode.id;
    const newList = list.map(n => {
        let updated = { ...n };
        if (n.id === headId) updated.prev = newNodeId;
        if (n.id === tailNode.id) updated.next = newNodeId;
        return updated;
    });
    yield { 
      description: "Appended newNode. Linked it between old tail and head.", 
      line: 15, 
      linkedList: { nodes: [...newList, newNode], headId, activeId: newNodeId, type: 'circular-doubly' } 
    };
  }
}

export function* circularDoublyLLDelete(val, inputs) {
  let list = inputs?.list || [];
  let headId = inputs?.headId;
  const action = inputs?.action || 'head';
  const targetVal = typeof val === 'object' ? val.searchVal || val.val : val;

  if (list.length === 0) return;

  yield { 
    description: `Target: Delete ${action.toUpperCase()} from Circular Doubly LL.`, 
    line: 1, 
    linkedList: { nodes: [...list], headId, type: 'circular-doubly' } 
  };

  if (list.length === 1) {
    yield { description: "Removing the only node. List is now empty.", line: 5, linkedList: { nodes: [], headId: null, type: 'circular-doubly' } };
    return;
  }

  const headNode = list.find(n => n.id === headId);
  const tailNode = list.find(n => n.id === headNode.prev);

  if (action === 'head') {
    const nextNodeId = headNode.next;
    const newList = list.filter(n => n.id !== headId).map(n => {
        if (n.id === nextNodeId) return { ...n, prev: tailNode.id };
        if (n.id === tailNode.id) return { ...n, next: nextNodeId };
        return n;
    });
    yield { 
      description: "Step 1: Link tail node and second node directly. Old head removed.", 
      line: 10, 
      linkedList: { nodes: newList, headId: nextNodeId, type: 'circular-doubly' } 
    };
  } else if (action === 'tail') {
    const penultimateNodeId = tailNode.prev;
    const newList = list.filter(n => n.id !== tailNode.id).map(n => {
        if (n.id === penultimateNodeId) return { ...n, next: headId };
        if (n.id === headId) return { ...n, prev: penultimateNodeId };
        return n;
    });
    yield { 
      description: "Step 1: Link penultimate node back to head node. Old tail removed.", 
      line: 15, 
      linkedList: { nodes: newList, headId, type: 'circular-doubly' } 
    };
  } else if (action === 'value') {
    if (headNode.val === Number(targetVal)) {
        yield* circularDoublyLLDelete(val, { ...inputs, action: 'head' });
        return;
    }

    let foundNode = list.find(n => n.val === Number(targetVal));
    if (!foundNode) {
        yield { description: `Value ${targetVal} not found in list.`, line: 15, linkedList: { nodes: [...list], headId, type: 'circular-doubly' } };
        return;
    }

    if (foundNode.id === tailNode.id) {
        yield* circularDoublyLLDelete(val, { ...inputs, action: 'tail' });
        return;
    }

    const prevNodeId = foundNode.prev;
    const nextNodeId = foundNode.next;
    const newList = list.filter(n => n.id !== foundNode.id).map(n => {
        if (n.id === prevNodeId) return { ...n, next: nextNodeId };
        if (n.id === nextNodeId) return { ...n, prev: prevNodeId };
        return n;
    });

    yield { 
      description: `Removed node with value ${targetVal}. Updated neighbors ${prevNodeId} and ${nextNodeId}.`, 
      line: 20, 
      linkedList: { nodes: newList, headId, type: 'circular-doubly' } 
    };
  }
}

