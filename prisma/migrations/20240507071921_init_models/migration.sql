-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotarizedData" (
    "id" SERIAL NOT NULL,
    "deviceId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "temprature" TEXT NOT NULL,
    "totalEnergy" DECIMAL(65,30) NOT NULL,
    "today" DECIMAL(65,30) NOT NULL,
    "power" INTEGER NOT NULL,
    "apparentPower" INTEGER NOT NULL,
    "reactivePower" INTEGER NOT NULL,
    "factor" DECIMAL(65,30) NOT NULL,
    "voltage" INTEGER NOT NULL,
    "current" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "NotarizedData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotarizedData" ADD CONSTRAINT "NotarizedData_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
