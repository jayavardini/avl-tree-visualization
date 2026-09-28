class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

let root = null;

// Get height
function getHeight(node) {
    if (node === null) {
        return 0;
    }

    return node.height;
}

// Get balance factor
function getBalance(node) {
    if (node === null) {
        return 0;
    }

    return getHeight(node.left) - getHeight(node.right);
}

// Right Rotation
function rightRotate(y) {

    let x = y.left;
    let temp = x.right;

    x.right = y;
    y.left = temp;

    y.height = 1 + Math.max(
        getHeight(y.left),
        getHeight(y.right)
    );

    x.height = 1 + Math.max(
        getHeight(x.left),
        getHeight(x.right)
    );

    return x;
}

// Left Rotation
function leftRotate(x) {

    let y = x.right;
    let temp = y.left;

    y.left = x;
    x.right = temp;

    x.height = 1 + Math.max(
        getHeight(x.left),
        getHeight(x.right)
    );

    y.height = 1 + Math.max(
        getHeight(y.left),
        getHeight(y.right)
    );

    return y;
}

// Insert node
function insert(node, value) {

    // Normal BST insertion
    if (node === null) {
        return new Node(value);
    }

    if (value < node.value) {
        node.left = insert(node.left, value);
    }
    else if (value > node.value) {
        node.right = insert(node.right, value);
    }
    else {
        return node;
    }

    // Update height
    node.height = 1 + Math.max(
        getHeight(node.left),
        getHeight(node.right)
    );

    // Get balance factor
    let balance = getBalance(node);

    // LL Case
    if (balance > 1 && value < node.left.value) {
        return rightRotate(node);
    }

    // RR Case
    if (balance < -1 && value > node.right.value) {
        return leftRotate(node);
    }

    // LR Case
    if (balance > 1 && value > node.left.value) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // RL Case
    if (balance < -1 && value < node.right.value) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
}

// Insert button
function insertValue() {

    let input = document.getElementById("valueInput");
    let value = Number(input.value);

    if (input.value === "") {
        document.getElementById("message").innerText =
            "Please enter a value.";
        return;
    }

    root = insert(root, value);

    document.getElementById("message").innerText =
        "Inserted " + value + " into AVL Tree.";

    input.value = "";

    drawTree();
}


// Reset tree
function resetTree() {

    root = null;

    document.getElementById("treeContainer").innerHTML = "";

    document.getElementById("message").innerText =
        "Tree has been reset.";
}


// Draw tree
function drawTree() {

    let container = document.getElementById("treeContainer");

    container.innerHTML = "";

    if (root === null) {
        return;
    }

    let positions = [];

    calculatePositions(
        root,
        0,
        0,
        800
    );

    // Draw connecting lines
    drawEdges(root);

    // Draw nodes
    positions.forEach(function(item) {

        let nodeElement = document.createElement("div");

        nodeElement.className = "node";

        nodeElement.innerText = item.node.value;

        nodeElement.style.left =
            item.x + "px";

        nodeElement.style.top =
            item.y + "px";

        container.appendChild(nodeElement);
    });

    function calculatePositions(node, depth, left, right) {

        if (node === null) {
            return;
        }

        let x = (left + right) / 2;
        let y = depth * 100 + 20;

        positions.push({
            node: node,
            x: x,
            y: y
        });

        calculatePositions(
            node.left,
            depth + 1,
            left,
            x
        );

        calculatePositions(
            node.right,
            depth + 1,
            x,
            right
        );
    }
}


// Draw edges
function drawEdges(node) {

    if (node === null) {
        return;
    }

    let parent = findPosition(node);

    if (node.left !== null) {

        let child = findPosition(node.left);

        createLine(
            parent.x + 25,
            parent.y + 25,
            child.x + 25,
            child.y + 25
        );

        drawEdges(node.left);
    }

    if (node.right !== null) {

        let child = findPosition(node.right);

        createLine(
            parent.x + 25,
            parent.y + 25,
            child.x + 25,
            child.y + 25
        );

        drawEdges(node.right);
    }
}


// Find node position
function findPosition(target) {

    let result = null;

    function search(node, depth, left, right) {

        if (node === null || result !== null) {
            return;
        }

        let x = (left + right) / 2;
        let y = depth * 100 + 20;

        if (node === target) {
            result = {
                x: x,
                y: y
            };

            return;
        }

        search(node.left, depth + 1, left, x);
        search(node.right, depth + 1, x, right);
    }

    search(root, 0, 0, 800);

    return result;
}


// Create connecting line
function createLine(x1, y1, x2, y2) {

    let line = document.createElement("div");

    line.className = "edge";

    let dx = x2 - x1;
    let dy = y2 - y1;

    let length = Math.sqrt(
        dx * dx + dy * dy
    );

    let angle = Math.atan2(dy, dx);

    line.style.width = length + "px";

    line.style.left = x1 + "px";
    line.style.top = y1 + "px";

    line.style.transform =
        "rotate(" + angle + "rad)";

    document.getElementById(
        "treeContainer"
    ).appendChild(line);
}